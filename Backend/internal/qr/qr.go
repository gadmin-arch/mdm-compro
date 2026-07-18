// Package qr renders branded QR codes for short links: SVG (vector), PNG
// (raster, optionally transparent), and a print-ready single-page PDF. Error
// correction is fixed at the highest level (H, ~30%) so the centered company
// logo never breaks scannability.
package qr

import (
	"bytes"
	_ "embed"
	"encoding/base64"
	"fmt"
	"image"
	"image/color"
	"image/draw"
	"image/jpeg"
	"image/png"
	"strings"

	qrcode "github.com/skip2/go-qrcode"
	xdraw "golang.org/x/image/draw"
)

//go:embed logo.png
var logoBytes []byte

type Options struct {
	Format      string // svg | png | pdf
	Size        int    // pixels (png/pdf); svg scales freely
	Transparent bool   // png/svg only; pdf is always white
	Logo        bool
}

// logoFraction is the logo's share of the QR edge. 20% of the edge ≈ 4% of
// the modules — comfortably inside level-H's 30% recovery budget.
const logoFraction = 5 // logo edge = size/5

var allowedSizes = map[int]bool{256: true, 512: true, 1024: true, 2048: true, 4096: true}

// Normalize clamps user-supplied options to safe values.
func Normalize(opts Options) Options {
	if !allowedSizes[opts.Size] {
		opts.Size = 1024
	}
	switch opts.Format {
	case "svg", "pdf":
	default:
		opts.Format = "png"
	}
	if opts.Format == "pdf" {
		opts.Transparent = false
	}
	return opts
}

// Generate renders the QR for content. Returns bytes, MIME type, and a file
// extension.
func Generate(content string, opts Options) ([]byte, string, string, error) {
	opts = Normalize(opts)
	code, err := qrcode.New(content, qrcode.Highest)
	if err != nil {
		return nil, "", "", err
	}
	code.DisableBorder = false

	switch opts.Format {
	case "svg":
		data, err := renderSVG(code, opts)
		return data, "image/svg+xml", "svg", err
	case "pdf":
		data, err := renderPDF(code, opts)
		return data, "application/pdf", "pdf", err
	default:
		data, err := renderPNG(code, opts)
		return data, "image/png", "png", err
	}
}

// --- PNG ---

func renderPNG(code *qrcode.QRCode, opts Options) ([]byte, error) {
	if opts.Transparent {
		code.BackgroundColor = color.RGBA{0, 0, 0, 0}
	} else {
		code.BackgroundColor = color.White
	}
	code.ForegroundColor = color.Black

	base := code.Image(opts.Size)
	canvas := image.NewRGBA(base.Bounds())
	draw.Draw(canvas, canvas.Bounds(), base, image.Point{}, draw.Src)

	if opts.Logo {
		if err := overlayLogo(canvas, opts.Size); err != nil {
			return nil, err
		}
	}

	var buffer bytes.Buffer
	err := png.Encode(&buffer, canvas)
	return buffer.Bytes(), err
}

// overlayLogo draws a white rounded pad + the company logo centered on the
// canvas. The pad keeps the logo readable on any background.
func overlayLogo(canvas *image.RGBA, size int) error {
	logo, err := png.Decode(bytes.NewReader(logoBytes))
	if err != nil {
		return err
	}

	logoEdge := size / logoFraction
	pad := logoEdge / 8
	padEdge := logoEdge + pad*2
	origin := (size - padEdge) / 2

	// White pad (square with slightly rounded feel via plain square — crisp
	// for print).
	padRect := image.Rect(origin, origin, origin+padEdge, origin+padEdge)
	draw.Draw(canvas, padRect, &image.Uniform{C: color.White}, image.Point{}, draw.Src)

	// Scale the logo preserving aspect ratio inside logoEdge².
	bounds := logo.Bounds()
	w, h := bounds.Dx(), bounds.Dy()
	scale := float64(logoEdge) / float64(max(w, h))
	dstW := int(float64(w) * scale)
	dstH := int(float64(h) * scale)
	dstX := origin + pad + (logoEdge-dstW)/2
	dstY := origin + pad + (logoEdge-dstH)/2
	dstRect := image.Rect(dstX, dstY, dstX+dstW, dstY+dstH)
	xdraw.CatmullRom.Scale(canvas, dstRect, logo, bounds, xdraw.Over, nil)
	return nil
}

// --- SVG ---

func renderSVG(code *qrcode.QRCode, opts Options) ([]byte, error) {
	bitmap := code.Bitmap() // includes the quiet-zone border
	modules := len(bitmap)

	var b strings.Builder
	fmt.Fprintf(&b, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %d %d" shape-rendering="crispEdges">`, modules, modules)
	if !opts.Transparent {
		fmt.Fprintf(&b, `<rect width="%d" height="%d" fill="#ffffff"/>`, modules, modules)
	}

	// Merge horizontal runs into single rects to keep the file small.
	b.WriteString(`<path fill="#000000" d="`)
	for y, row := range bitmap {
		run := -1
		for x := 0; x <= len(row); x++ {
			filled := x < len(row) && row[x]
			if filled && run < 0 {
				run = x
			}
			if !filled && run >= 0 {
				fmt.Fprintf(&b, "M%d %dh%dv1H%dz", run, y, x-run, run)
				run = -1
			}
		}
	}
	b.WriteString(`"/>`)

	if opts.Logo {
		logoEdge := float64(modules) / float64(logoFraction)
		pad := logoEdge / 8
		padEdge := logoEdge + pad*2
		origin := (float64(modules) - padEdge) / 2
		fmt.Fprintf(&b, `<rect x="%.2f" y="%.2f" width="%.2f" height="%.2f" rx="%.2f" fill="#ffffff"/>`,
			origin, origin, padEdge, padEdge, pad)
		fmt.Fprintf(&b, `<image x="%.2f" y="%.2f" width="%.2f" height="%.2f" preserveAspectRatio="xMidYMid meet" href="data:image/png;base64,%s"/>`,
			origin+pad, origin+pad, logoEdge, logoEdge, base64.StdEncoding.EncodeToString(logoBytes))
	}
	b.WriteString(`</svg>`)
	return []byte(b.String()), nil
}

// --- PDF ---

// renderPDF wraps the raster QR into a minimal one-page PDF sized 100×100mm.
// At the default 2048px that is ~520 DPI — comfortably print-ready.
func renderPDF(code *qrcode.QRCode, opts Options) ([]byte, error) {
	code.BackgroundColor = color.White
	code.ForegroundColor = color.Black

	base := code.Image(opts.Size)
	canvas := image.NewRGBA(base.Bounds())
	draw.Draw(canvas, canvas.Bounds(), &image.Uniform{C: color.White}, image.Point{}, draw.Src)
	draw.Draw(canvas, canvas.Bounds(), base, image.Point{}, draw.Over)
	if opts.Logo {
		if err := overlayLogo(canvas, opts.Size); err != nil {
			return nil, err
		}
	}

	var jpegBuffer bytes.Buffer
	if err := jpeg.Encode(&jpegBuffer, canvas, &jpeg.Options{Quality: 95}); err != nil {
		return nil, err
	}
	return wrapJPEGInPDF(jpegBuffer.Bytes(), opts.Size, opts.Size), nil
}

// wrapJPEGInPDF emits a hand-rolled single-page PDF (100×100mm MediaBox)
// containing one DCT-encoded image — no external PDF dependency needed.
func wrapJPEGInPDF(jpegData []byte, pxW, pxH int) []byte {
	const pageSize = 283.46 // 100mm in PostScript points

	var body bytes.Buffer
	offsets := make([]int, 0, 6)
	write := func(s string) {
		body.WriteString(s)
	}
	beginObj := func() {
		offsets = append(offsets, body.Len())
	}

	write("%PDF-1.4\n")

	beginObj()
	write("1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n")

	beginObj()
	write("2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n")

	beginObj()
	write(fmt.Sprintf("3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 %.2f %.2f] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>\nendobj\n", pageSize, pageSize))

	beginObj()
	write(fmt.Sprintf("4 0 obj\n<< /Type /XObject /Subtype /Image /Width %d /Height %d /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length %d >>\nstream\n", pxW, pxH, len(jpegData)))
	body.Write(jpegData)
	write("\nendstream\nendobj\n")

	content := fmt.Sprintf("q %.2f 0 0 %.2f 0 0 cm /Im0 Do Q", pageSize, pageSize)
	beginObj()
	write(fmt.Sprintf("5 0 obj\n<< /Length %d >>\nstream\n%s\nendstream\nendobj\n", len(content), content))

	xrefOffset := body.Len()
	write(fmt.Sprintf("xref\n0 %d\n0000000000 65535 f \n", len(offsets)+1))
	for _, offset := range offsets {
		write(fmt.Sprintf("%010d 00000 n \n", offset))
	}
	write(fmt.Sprintf("trailer\n<< /Size %d /Root 1 0 R >>\nstartxref\n%d\n%%%%EOF\n", len(offsets)+1, xrefOffset))
	return body.Bytes()
}
