using System.Collections.Concurrent;

public static class OtpStore
{
    public static ConcurrentDictionary<string, OtpItem> Data
        = new();

    public class OtpItem
    {
        public string Code { get; set; }

        public DateTime Expire { get; set; }
    }
}