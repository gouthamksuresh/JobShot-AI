import requests
from bs4 import BeautifulSoup
import re

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36"
}

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
    resp = requests.get(url, headers=HEADERS, timeout=10)
    soup = BeautifulSoup(resp.text, "html.parser")

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
    resp = requests.get(url, headers=HEADERS, timeout=10)
    soup = BeautifulSoup(resp.text, "html.parser")

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
    resp = requests.get(url, headers=HEADERS, timeout=10)
    soup = BeautifulSoup(resp.text, "html.parser")

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
