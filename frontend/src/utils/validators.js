export function validateName(name){
  if (!name) return false
  return name.length >= 20 && name.length <= 60
}

export function validateAddress(addr){
  if (addr == null) return true
  return addr.length <= 400
}

export function validatePassword(pw){
  if (!pw) return false
  if (pw.length < 8 || pw.length > 16) return false
  if (!/[A-Z]/.test(pw)) return false
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(pw)) return false
  return true
}

export function validateEmail(email){
  if (!email) return false
  // simple regex for email
  return /^\S+@\S+\.\S+$/.test(email)
}
