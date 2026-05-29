import anthropic
import json

client = anthropic.Anthropic()  # reads ANTHROPIC_API_KEY from env

def generate_all(profile: dict, job_description: str, company: str, role: str, hr_email: str) -> dict:
    """Generate tailored resume, cover letter, and email using Claude"""

    profile_str = json.dumps(profile, indent=2)

    prompt = f"""You are JobShot AI — a professional career assistant.

## Candidate Profile (JSON Brain):
{profile_str}

## Job Details:
Company: {company}
Role: {role}
HR Email: {hr_email}
Job Description:
{job_description}

## Your Task:
Generate THREE things tailored specifically for this job. Return ONLY valid JSON with these exact keys:

{{
  "resume": "Full tailored resume text — highlight the most relevant skills and experience for THIS role. Lead with the most relevant experience. Bold key terms with **asterisks**.",
  "cover_letter": "3-paragraph professional cover letter. Para 1: Hook + role. Para 2: Most relevant experience (DevOps/Data internship + key project). Para 3: Enthusiasm + CTA. Keep it under 200 words.",
  "email_body": "Short professional email to HR. Max 5 lines. Subject line NOT included. Start with Hi [Name] or Hi Team. End with name + phone. Sharp, confident, not desperate.",
  "matched_skills": ["skill1", "skill2", "skill3"],
  "match_score": 85,
  "highlights": ["key strength 1 for this role", "key strength 2", "key strength 3"]
}}

Rules:
- The resume must genuinely tailor to the job — reorder sections, highlight matching skills first
- Cover letter must feel personal, not templated
- Email must be short and confident — never more than 6 lines
- match_score is 0-100 based on how well the profile matches the job
- Return ONLY the JSON object, no preamble, no markdown backticks"""

    message = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=2000,
        messages=[{"role": "user", "content": prompt}]
    )

    text = message.content[0].text.strip()

    # Strip markdown fences if present
    if text.startswith("```"):
        text = text.split("```")[1]
        if text.startswith("json"):
            text = text[4:]
    text = text.strip()

    return json.loads(text)
