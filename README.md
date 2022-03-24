# strikedao.com

[![Node.js CI](https://github.com/strikedao/strikedao.com/actions/workflows/node.js.yml/badge.svg)](https://github.com/strikedao/strikedao.com/actions/workflows/node.js.yml)

<p align="center">
  <img src="/assets/logo.png" />
</p>

### Strike DAO is an experiment in participatory governance of blockchain art institutions.

#### [context](README.md#context) | [documentation](README.md#documentation) | [license](README.md/#license)

## context

Strike DAO is an experiment in participatory governance of blockchain art
institutions. The Ethereum domain of Bundeskunsthalle ("bundeskunsthalle.eth")
was squatted by artist Hito Steyerl and the Department of Decentralization. In
an event helt at Bundeskunsthalle in Bonn, Germany, on March 16, 2022, the
application was used to vote on three models of future governance.

The voting will took place as a quadratic voting process in which votes were
allocated to express the degree of their preferences. Every participant voter
was given a budget of 25 video stills that they could use to proportionally
demonstrate support. I. e. one still equaled one vote, four stills equaled two
votes, and nine stills equaled three votes.

Three suggestions on how to run bundeskunsthalle.eth were be presented during
the live event. Participants signed up and received stills by mail as voting
tokens. They used them to vote either before the event or during the event -
results were presented at the end.

To display the results, the videostills of the original video Strike were
rearranged to reflect the voting process and the temporal order of the voting
process. Thus the original sequence was jumbled by a participatory process. The
new version of "Strike" is the document of the process.

Further resources:

- [strikedao.com](https://strikedao.com)
- [March 16, 2022 Voting Results](https://strikedao.com/result)
- ["STUDIO BONN – Who controls the Bundeskunsthalle? Cast your Vote!"
  (recording of the event)](https://www.youtube.com/watch?v=x3eLgH-Vm74)
- [studiobonn.io](http://studiobonn.io)

## documentation

### prerequisites

- You'll need to have `ffmpeg` globally available in your command line.

### installation

Clone the repository on your machine and `cd` into the folder.

```bash
cp .env-copy .env
# You might need to create a mailgun account or mock that part away
make setup
pm2 start
```

- It's recommended setting up an nginx reverse-proxy too. Check the `./proxy`
  folder and its `Makefile` for that.

### visual debugging of mjml-designed email templates

- We use [mjml](https://documentation.mjml.io) to format our emails
  responsively.
- The templates can be found in `src/templates`.
- For visual debugging, use the following command line options:

```bash
mjml --watch ./src/templates/signup.mjml --output test.html
```

**NOTE:** `mjml` may have to be installed globally using `npm i -g`.

### debugging the api

### exemplary calls using `curl`

```bash
curl \
  -X PATCH \
  --data '{"email":"your@email.com"}' \
  -H "Content-Type: application/json" \
  "http://localhost:5000/api/v1/stills/"
```

## license

See LICENSE file.
