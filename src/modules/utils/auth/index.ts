import md5 from 'md5'

export class AuthUtils {
  static generateKey(className: string, suffix: string): string {
    const prefix = `${className}-signIn`
    return md5(`${prefix}-${suffix}`)
  }
}
