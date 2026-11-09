# saicharan-dotnet.github.io

Portfolio site for **Sai Charan Venkata Chenna**, Senior .NET Developer. Live at https://saicharan-dotnet.github.io.

Plain HTML, CSS and JavaScript, so GitHub Pages serves it as is. No build step.

| File | What it is |
| --- | --- |
| `index.html` | The page: hero, about, skills, experience, projects, approach, resume and contact sections |
| `style.css` | All styles, with dark and light themes |
| `script.js` | Theme toggle, mobile menu, scroll animations, skill filters, typed headline |
| `assets/` | Web-sized profile photos (JPEG + WebP) and app icon |
| `robots.txt`, `sitemap.xml` | Crawling rules and sitemap for search engines |
| `llms.txt` | Plain-text profile for AI answer engines |
| `404.html` | Not-found page |
| `resume/resume.html` | Source of the resume |
| `Sai_Charan_Senior_DotNet_Developer_Resume.pdf` | The resume PDF linked from the site |

## Updating the resume

Edit `resume/resume.html`, then regenerate the PDF:

```bash
npm i -D playwright && npx playwright install chromium   # first time only
node resume/build-pdf.js
```

Keep the site's Experience and Projects sections in step with the resume.
