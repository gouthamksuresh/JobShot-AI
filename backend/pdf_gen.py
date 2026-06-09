from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable, Table, TableStyle
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_RIGHT

PAGE_W = A4[0] - 26*mm
DARK   = colors.HexColor('#0D1117')
ACCENT = colors.HexColor('#1A6AFF')
LIGHT  = colors.HexColor('#4A5568')
MUTED  = colors.HexColor('#718096')
RULE   = colors.HexColor('#E2E8F0')

def S(name, **kw):
    base = dict(fontName='Helvetica', fontSize=10, leading=14,
                textColor=DARK, spaceAfter=0, spaceBefore=0)
    base.update(kw)
    return ParagraphStyle(name, **base)

def generate_resume_pdf(resume_text: str = "", company: str = "") -> str:
    """Generate the master resume PDF (same as locked resume v4)"""
    import tempfile, os
    output_path = os.path.join(tempfile.gettempdir(), "resume_output.pdf")

    NAME    = S('name', fontName='Helvetica-Bold', fontSize=24, leading=28)
    TAGLINE = S('tag',  fontSize=10, textColor=LIGHT, leading=14)
    CONTACT = S('con',  fontSize=8.5, textColor=LIGHT, leading=13)
    SEC_HDR = S('sec',  fontName='Helvetica-Bold', fontSize=9, textColor=ACCENT, spaceBefore=7, spaceAfter=1, leading=12)
    ROLE    = S('role', fontName='Helvetica-Bold', fontSize=9.5, leading=13)
    ORG     = S('org',  fontName='Helvetica-Oblique', fontSize=8.8, textColor=LIGHT, leading=12)
    BODY    = S('body', fontSize=8.8, leading=13.5)
    BULLET  = S('bul',  fontSize=8.8, leading=13.5, leftIndent=9)
    SKILL_K = S('sk',   fontName='Helvetica-Bold', fontSize=8.5, leading=13)
    SKILL_V = S('sv',   fontSize=8.5, leading=13, textColor=LIGHT)
    EDU_DT  = S('edt',  fontSize=8.5, leading=12, textColor=MUTED)
    DT_R    = S('dtr',  fontSize=8.5, alignment=TA_RIGHT, textColor=MUTED, leading=13)

    def rule(): return HRFlowable(width='100%', thickness=0.4, color=RULE, spaceAfter=3, spaceBefore=1)
    def accentrule(): return HRFlowable(width='100%', thickness=1.5, color=ACCENT, spaceAfter=6)
    def section(t): return [Paragraph(t.upper(), SEC_HDR), rule()]
    def bullet(text): return Paragraph(f"<bullet>&bull;</bullet>&nbsp;{text}", BULLET)
    def twoCol(l, r, lw=0.73):
        t = Table([[l, r]], colWidths=[PAGE_W*lw, PAGE_W*(1-lw)])
        t.setStyle(TableStyle([
            ('VALIGN',(0,0),(-1,-1),'TOP'),
            ('LEFTPADDING',(0,0),(-1,-1),0), ('RIGHTPADDING',(0,0),(-1,-1),0),
            ('TOPPADDING',(0,0),(-1,-1),0),  ('BOTTOMPADDING',(0,0),(-1,-1),0),
        ]))
        return t

    doc = SimpleDocTemplate(output_path, pagesize=A4,
                            leftMargin=13*mm, rightMargin=13*mm,
                            topMargin=12*mm, bottomMargin=11*mm)
    story = []

    story.append(Paragraph('Goutham K Suresh', NAME))
    story.append(Spacer(1, 3))
    story.append(Paragraph('DevOps Engineer &nbsp;|&nbsp; Cloud &amp; Infrastructure &nbsp;|&nbsp; SRE', TAGLINE))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        'Kodungallur, Kerala, India &nbsp;&bull;&nbsp; +91 9746154656 &nbsp;&bull;&nbsp; me.goutham.tech@gmail.com'
        '&nbsp;&bull;&nbsp; linkedin.com/in/gouthamksuresh'
        '&nbsp;&bull;&nbsp; github.com/gouthamksuresh', CONTACT))
    story.append(Spacer(1, 7))
    story.append(accentrule())

    story += section('Professional Summary')
    story.append(Paragraph(
        'BCA graduate (AI Specialization) with <b>two internships</b> — DevOps at Elevate Labs and Data Science at Prinston Smart Engineers. '
        'Hands-on with <b>Jenkins, GitHub Actions, Docker, Kubernetes, AWS, GCP, Python, and Pandas</b>. '
        'Built a live full-stack commercial website for a UK client using Next.js, React, and Supabase — complete with admin dashboard and authentication — '
        'alongside an internship management system, a laptop recommendation engine, and an automated CI/CD pipeline. '
        'Certified in Google Cloud and AI with Python. Seeking a <b>DevOps / Cloud / SRE role</b> where I can contribute from day one.', BODY))
    story.append(Spacer(1, 5))

    story += section('Experience')
    story.append(twoCol(Paragraph('DevOps Intern', ROLE), Paragraph('Sep 2025 – Jan 2026', DT_R)))
    story.append(Paragraph('Elevate Labs &nbsp;&bull;&nbsp; Bengaluru, India', ORG))
    story.append(Spacer(1, 2))
    for b in [
        'Designed and optimized CI/CD pipelines using <b>Jenkins</b> and <b>GitHub Actions</b>, reducing manual deployment effort and improving release efficiency',
        'Containerized applications using <b>Docker</b> and orchestrated deployments via <b>Kubernetes</b>, enhancing scalability and environment consistency',
        'Deployed containerized workloads on <b>AWS</b> and <b>GCP</b>, architecting scalable and fault-tolerant cloud infrastructure',
        'Monitored pipeline performance and system health metrics, ensuring continuous stability and rapid incident response',
        'Simulated production-grade release workflows: automated multi-stage build, test, and deployment cycles',
    ]:
        story.append(bullet(b))
    story.append(Spacer(1, 5))

    story.append(twoCol(Paragraph('Data Science Intern', ROLE), Paragraph('Jan 2025 – Mar 2025', DT_R)))
    story.append(Paragraph('Prinston Smart Engineers &nbsp;&bull;&nbsp; Bengaluru, India', ORG))
    story.append(Spacer(1, 2))
    for b in [
        'Analyzed real-world datasets using <b>Python</b> and <b>Pandas</b>, extracting insights through data cleaning, transformation, and aggregation',
        'Designed and built a rule-based <b>laptop recommendation system</b>, improving product selection speed by approximately <b>60%</b>',
        'Performed comprehensive <b>Exploratory Data Analysis (EDA)</b> — visualized distributions, correlations, and outliers to guide model strategy',
        'Explored and evaluated <b>Machine Learning models</b> for classification and recommendation tasks',
    ]:
        story.append(bullet(b))
    story.append(Spacer(1, 5))

    story += section('Projects')
    projects = [
        ('DevFlow — Production-Grade DevOps Pipeline',
         'Docker · Kubernetes · Terraform · GitHub Actions · AWS · Prometheus · Grafana',
         'In Progress',
         ['End-to-end pipeline: Dockerized app → GitHub Actions CI/CD → Terraform IaC → AWS → Kubernetes orchestration',
          'Live observability with Prometheus + Grafana; Bash automation scripts for operational tasks']),
        ('JobShot AI — Automated Job Application Engine',
         'Python · FastAPI · React · Claude AI API · Playwright · Gmail SMTP',
         'In Progress',
         ['AI agent: reads job posting → tailors resume → generates cover letter + email → sends in one click',
          'Built-in application tracker dashboard; personal AI-powered career assistant']),
        ('CI/CD Pipeline Automation', 'Jenkins · GitHub Actions · Docker', 'Dec 2025',
         ['Automated build, test and deployment pipeline; containerized for consistent environments',
          'Reduced manual deployment effort and improved release reliability']),
        ('Internship Management System', 'Python · Flask · SQLite · HTML · CSS · JavaScript', 'Jan 2025',
         ['Full-stack platform reducing manual workload by <b>70%</b>; role-based dashboards improving efficiency by <b>3×</b>',
          'Intelligent resume scanner increasing employer-student match accuracy by <b>45%</b>']),
        ('JSS Beauty — Full-Stack Client Web Application',
         'Next.js · React · Supabase · Tailwind CSS · Framer Motion · TypeScript', '2024',
         ['Built a fully custom salon website with admin dashboard for a real UK client — jssbeauty.co.uk',
          'Implemented Supabase Auth with Row Level Security, image storage, and full CRUD']),
    ]
    for name, stack, date, points in projects:
        story.append(twoCol(Paragraph(name, ROLE), Paragraph(date, DT_R)))
        story.append(Paragraph(stack, ORG))
        story.append(Spacer(1, 2))
        for b in points: story.append(bullet(b))
        story.append(Spacer(1, 4))

    story += section('Technical Skills')
    skills = [
        ('DevOps & Cloud',  'Docker · Kubernetes · Jenkins · GitHub Actions · AWS · GCP · CI/CD · Terraform (learning) · Linux · Bash'),
        ('Data Science',    'Python · Pandas · EDA · Rule-based Systems · ML Model Evaluation'),
        ('Programming',     'Python · JavaScript · Java · C · C# · PHP · SQL'),
        ('Frameworks',      'Flask · Next.js · React · Tailwind CSS'),
        ('Databases',       'MySQL · SQLite · Supabase'),
        ('Tools',           'Git · GitHub · VS Code · Open Source Tools'),
    ]
    for k, v in skills:
        t = Table([[Paragraph(k+':', SKILL_K), Paragraph(v, SKILL_V)]],
                  colWidths=[PAGE_W*0.185, PAGE_W*0.815])
        t.setStyle(TableStyle([('VALIGN',(0,0),(-1,-1),'TOP'),
            ('LEFTPADDING',(0,0),(-1,-1),0),('RIGHTPADDING',(0,0),(-1,-1),0),
            ('TOPPADDING',(0,0),(-1,-1),0), ('BOTTOMPADDING',(0,0),(-1,-1),2)]))
        story.append(t)
    story.append(Spacer(1, 5))

    story += section('Education')
    for title, school, year, detail in [
        ('Bachelor of Computer Applications — AI Specialization',
         'Bengaluru North University · Krupanidhi Degree College', '2022–2025',
         'CGPA: 6.59 | Final Sem: 71.14% | Internship: 90/100 | Project: 130/150'),
        ('Class XII — Computer Science',
         'Kerala Board of HSE · St. Joseph\'s HSS, Mathilakam', '2022',
         '70.33% | CS: 166/200 (A) | Physics: 160/200 (A)'),
        ('Class X — CBSE', 'Amrita Vidyalayam, Kodungallur, Thrissur', '2020', 'Passed'),
    ]:
        story.append(twoCol(Paragraph(title, ROLE), Paragraph(year, DT_R)))
        story.append(Paragraph(school, ORG))
        story.append(Paragraph(detail, EDU_DT))
        story.append(Spacer(1, 4))

    story += section('Certifications & Additional')
    for k, v in [
        ('Certifications', 'AI with Python — Keonics | Google Cloud Fundamentals — Qwiklabs'),
        ('Languages', 'English | Malayalam | Hindi'),
        ('Interests', 'Open Source · Cloud Infrastructure · AI/ML · DevOps Automation'),
    ]:
        t = Table([[Paragraph(k+':', SKILL_K), Paragraph(v, SKILL_V)]],
                  colWidths=[PAGE_W*0.185, PAGE_W*0.815])
        t.setStyle(TableStyle([('VALIGN',(0,0),(-1,-1),'TOP'),
            ('LEFTPADDING',(0,0),(-1,-1),0),('RIGHTPADDING',(0,0),(-1,-1),0),
            ('TOPPADDING',(0,0),(-1,-1),0), ('BOTTOMPADDING',(0,0),(-1,-1),2)]))
        story.append(t)

    doc.build(story)
    return output_path
