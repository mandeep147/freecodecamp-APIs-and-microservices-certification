##API Project: Request Header Parser Microservice

User Story:

1. I can get the IP address, preferred languages (from header Accept-Language) and system infos (from header User-Agent) for my device.

Example Usage:
`[base url]/api/whoami`

Example Output:
```
    {
        "ipaddress":"159.20.14.100",
        "language":"en-US,en;q=0.5",
        "software":"Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:50.0) Gecko/20100101 Firefox/50.0"
    }
```