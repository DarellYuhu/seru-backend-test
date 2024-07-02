export class Config {
  public static PORT = Bun.env.PORT;
  public static DATABASE_URL = Bun.env.DATABASE_URL;
  public static JWT_SECRET = Bun.env.JWT_SECRET || "secret";
}
