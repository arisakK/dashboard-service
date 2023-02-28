export default class Environment {
  public static isDev(): boolean {
    return Environment.getStage() === 'development';
  }

  public static isStaging(): boolean {
    return Environment.getStage() === 'staging';
  }

  public static isProd(): boolean {
    return Environment.getStage() === 'production';
  }

  public static getStage(): string {
    return process.env.NODE_ENV || 'development';
  }

  public static getPort(): number {
    return (process.env.PORT as any) || 4000;
  }

  public static getDomain(): string {
    return this.isDev() ? 'localhost' : 'krexpress.co';
  }

  public static getSecretKey(): string {
    return process.env.SECRET_KEY || 'super_secret';
  }
}
