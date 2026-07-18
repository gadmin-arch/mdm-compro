// Result contract for admin create/update server actions: they redirect on
// success and RETURN an error descriptor on failure (instead of redirecting)
// so client forms keep the user's edits alive.
export type SaveResult = {
  error: "conflict" | "duplicate" | "validation" | "upload_failed" | "save_failed"
  // Present on "conflict": the version currently stored on the server, used
  // to resubmit when the user chooses to overwrite.
  serverVersion?: number
}

export type SaveAction = (formData: FormData) => Promise<SaveResult | void>
