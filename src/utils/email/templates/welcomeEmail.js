export function generateWelcomeEmail(email, username, password, translations) {
    const enText = translations.en.welcome;
    const thText = translations.th.welcome;

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to DogGo! / ยินดีต้อนรับสู่ DogGo!</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f7f7f7;
                    color: #333;
                    padding: 20px;
                }
                .container {
                    background-color: #fff;
                    border-radius: 8px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    padding: 30px;
                    max-width: 600px;
                    margin: 0 auto;
                }
                h1 {
                    color: #2668E3;
                    text-align: center;
                }
                p {
                    font-size: 16px;
                    line-height: 1.6;
                }
                .footer {
                    text-align: center;
                    margin-top: 20px;
                    font-size: 14px;
                    color: #888;
                }
                .button {
                    display: inline-block;
                    background-color: #2668E3;
                    color: white;
                    padding: 10px 20px;
                    text-decoration: none;
                    border-radius: 5px;
                    margin-top: 20px;
                }
                .language-switch {
                    text-align: right;
                    margin-bottom: 10px;
                    font-size: 16px;
                }
                .language-link {
                    color: #666;
                    text-decoration: underline;
                    cursor: pointer;
                }
                /* Languages */
                .th-lang, .en-lang {
                    display: none;
                }
                /* Show English by default */
                .en-lang {
                    display: block;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="language-switch">
                    <a class="language-link" onclick="toggleLanguage()">
                        <span class="en-lang">${enText.switchLanguage}</span>
                        <span class="th-lang">${thText.switchLanguage}</span>
                    </a>
                </div>
                
                <!-- English Content -->
                <div class="en-lang">
                    <h1>${enText.title}</h1>
                    <p>${enText.accountCreated}</p>
                    <p>${enText.loginCredentials}</p>
                    <p><strong>${enText.username}</strong> ${username}</p>
                    <p><strong>${enText.email}</strong> ${email}</p>
                    <p><strong>${enText.password}</strong> ${password}</p>
                    <p>${enText.changePassword}</p>
                    <p>${enText.regards}<br>${enText.team}</p>
                    <a href="http://localhost:3000/" class="button">${enText.loginButton}</a>
                    <div class="footer">
                        <p>${enText.disclaimer}</p>
                    </div>
                </div>
                
                <!-- Thai Content -->
                <div class="th-lang">
                    <h1>${thText.title}</h1>
                    <p>${thText.accountCreated}</p>
                    <p>${thText.loginCredentials}</p>
                    <p><strong>${thText.username}</strong> ${username}</p>
                    <p><strong>${thText.email}</strong> ${email}</p>
                    <p><strong>${thText.password}</strong> ${password}</p>
                    <p>${thText.changePassword}</p>
                    <p>${thText.regards}<br>${thText.team}</p>
                    <a href="http://localhost:3000/" class="button">${thText.loginButton}</a>
                    <div class="footer">
                        <p>${thText.disclaimer}</p>
                    </div>
                </div>
                
                <script>
                    function toggleLanguage() {
                        const enElements = document.querySelectorAll('.en-lang');
                        const thElements = document.querySelectorAll('.th-lang');
                        
                        // Check if English is currently visible
                        const isEnglishVisible = window.getComputedStyle(enElements[0]).display !== 'none';
                        
                        // Toggle visibility
                        enElements.forEach(el => {
                            el.style.display = isEnglishVisible ? 'none' : 'block';
                        });
                        
                        thElements.forEach(el => {
                            el.style.display = isEnglishVisible ? 'block' : 'none';
                        });
                    }
                </script>
            </div>
        </body>
        </html>
    `;
}