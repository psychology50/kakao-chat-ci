export function exitProcess() {
  console.log("[INFO] : Exiting process");
  process.exit(0);
}

export function exitProcessWithError(req, res) {
  const error_message = req.query.message;
  if (!error_message) {
    console.error("No error message provided");
    process.exit(1);
  } else {
    const decode_error_message = decodeURIComponent(error_message);
    console.error(decode_error_message);
    process.exit(1);
  }
}
