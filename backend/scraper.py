import requests
from bs4 import BeautifulSoup
import re
import urllib.parse
import socket
import ipaddress

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36"
}

def is_safe_url(url: str) -> bool:
    try:
        parsed = urllib.parse.urlparse(url)
        if parsed.scheme not in ("http", "https"):
            return False
        hostname = parsed.hostname
        if not hostname:
            return False
        ip = socket.gethostbyname(hostname)
        ip_obj = ipaddress.ip_address(ip)
        if ip_obj.is_private or ip_obj.is_loopback or ip_obj.is_link_local or ip_obj.is_multicast:
            return False
        return True
    except Exception:
        return False

def safe_get_text(url: str, max_size: int = 2 * 1024 * 1024) -> str:
    if not is_safe_url(url):
        raise Exception("Unsafe or invalid URL.")
    with requests.get(url, headers=HEADERS, timeout=10, stream=True) as resp:
        resp.raise_for_status()
        content = b""
        for chunk in resp.iter_content(chunk_size=8192):
            content += chunk
            if len(content) > max_size:
                break
        return content.decode("utf-8", errors="replace")

def scrape_job(url: str) -> dict:
    """Scrape job description from URL. Handles LinkedIn, Naukri, generic pages."""
    try:
        if "linkedin.com" in url:
            return scrape_linkedin(url)
        elif "naukri.com" in url:
            return scrape_naukri(url)
        else:
            return scrape_generic(url)
    except Exception as e:
        print(f"Scrape error: {e}")
        return {"description": "", "company": "", "role": ""}

def scrape_linkedin(url: str) -> dict:
    text = safe_get_text(url)
    soup = BeautifulSoup(text, "html.parser")

    company = ""
    role = ""
    description = ""

    # Company
    c = soup.find("a", class_=re.compile("topcard__org-name"))
    if c:
        company = c.get_text(strip=True)

    # Role
    r = soup.find("h1", class_=re.compile("topcard__title"))
    if r:
        role = r.get_text(strip=True)

    # Description
    d = soup.find("div", class_=re.compile("description__text"))
    if d:
        description = d.get_text(separator="\n", strip=True)

    return {"company": company, "role": role, "description": description}

def scrape_naukri(url: str) -> dict:
    text = safe_get_text(url)
    soup = BeautifulSoup(text, "html.parser")

    company = ""
    role = ""
    description = ""

    c = soup.find("a", class_=re.compile("comp-name"))
    if c:
        company = c.get_text(strip=True)

    r = soup.find("h1", class_=re.compile("jd-header-title"))
    if r:
        role = r.get_text(strip=True)

    d = soup.find("div", class_=re.compile("job-desc"))
    if d:
        description = d.get_text(separator="\n", strip=True)

    return {"company": company, "role": role, "description": description}

def scrape_generic(url: str) -> dict:
    """Generic scraper for any job page"""
    text = safe_get_text(url)
    soup = BeautifulSoup(text, "html.parser")

    # Remove scripts/styles
    for tag in soup(["script", "style", "nav", "footer", "header"]):
        tag.decompose()

    text = soup.get_text(separator="\n", strip=True)

    # Get title as role
    title = soup.find("title")
    role = title.get_text(strip=True) if title else ""

    # Limit to 3000 chars
    description = "\n".join(
        line for line in text.splitlines() if line.strip()
    )[:3000]

    return {"company": "", "role": role, "description": description}
