// Startup file untuk cPanel "Setup Node.js App" (Phusion Passenger).
//
// Di panel Node.js App, set "Application startup file" = passenger-app.js
//
// Kenapa perlu wrapper ini: Next.js standalone menghasilkan server.js yang
// membaca process.env.PORT & HOSTNAME. Passenger cPanel kadang tidak menyetel
// HOSTNAME dan memberi PORT lewat variabel yang berbeda. Wrapper ini
// menormalkan keduanya lalu menjalankan server standalone bawaan Next.
process.env.HOSTNAME = process.env.HOSTNAME || "127.0.0.1";
process.env.PORT = process.env.PORT || "3000";
process.env.NODE_ENV = process.env.NODE_ENV || "production";

require("./server.js");
