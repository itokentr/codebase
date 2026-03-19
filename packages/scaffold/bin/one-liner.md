```sh
js=$(mktemp -u --suffix=.mjs);cat bin.js > $js;node $js;rm $js
```

```powershell
$js=join-path $env:TEMP "$(new-guid).mjs";cat bin.js > $js;node $js;rm $js
```
