# strike

- Intermediate deadline: Nov 9, 2021
- Launch: Feb 15, 2022 (postponed by Studio Bonn)

## installation

Clone the repository on your machine and `cd` into the folder.

```bash
apt-get update
sudo apt-get install build-essential
make setup
pm2 start
```

## api

### exemplary calls using `curl`

```bash
curl \
  -X PATCH \
  --data '{"email":"your@email.com"}' \
  -H "Content-Type: application/json" \
  "http://localhost:5000/stills/"
```
