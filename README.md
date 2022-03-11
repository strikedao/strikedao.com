# strike

## prerequisites

- You'll need to have `ffmpeg` globally available in your command line.

## installation

Clone the repository on your machine and `cd` into the folder.

```bash
cp .env-copy .env
# You might need to create a mailgun account or mock that part away
make setup
pm2 start
```

## visual debugging of mjml-designed email templates

- We use [mjml](https://documentation.mjml.io) to format our emails
  responsively.
- The templates can be found in `src/templates`.
- For visual debugging, use the following command line options:

```bash
mjml --watch ./src/templates/signup.mjml --output test.html
```

**NOTE:** `mjml` may have to be installed globally using `npm i -g`.

## api

### exemplary calls using `curl`

```bash
curl \
  -X PATCH \
  --data '{"email":"your@email.com"}' \
  -H "Content-Type: application/json" \
  "http://localhost:5000/api/v1/stills/"
```
