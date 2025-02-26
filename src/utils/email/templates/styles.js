export const emailStyles = `
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
        font-size: 12px;
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
`;

export const bookingStyles = `
    ${emailStyles}
    .details {
        background-color: #f7fafc;
        padding: 20px;
        border-radius: 8px;
        margin-bottom: 20px;
    }
    .container {
        max-width: 800px;
    }
    .button {
        text-align: center;
    }
`;