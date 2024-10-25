1. Run Ngrok

2. ngrok http 8000

3. you will get a url like: `"https://254b-2405-201-6015-d126-8092-2e61-4f3a-aeea.ngrok-free.app/`

4. Use it by:

```js
fetch("https://254b-2405-201-6015-d126-8092-2e61-4f3a-aeea.ngrok-free.app/", {
  method: "get",
  headers: new Headers({
    "ngrok-skip-browser-warning": "1",
  }),
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((err) => console.log(err));
```
