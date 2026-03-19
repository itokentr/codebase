# ABNF

https://datatracker.ietf.org/doc/html/rfc5234

# インターネット・メッセージ・フォーマット

https://datatracker.ietf.org/doc/html/rfc5322

# HTTP/1.1 メッセージ・シンタックス

https://datatracker.ietf.org/doc/html/rfc7230

```
token = 1*tchar
tchar = "!" / "#" / "$" / "%" / "&" / "'" / "*"
      / "+" / "-" / "." / "^" / "_" / "`" / "|" / "~"
      / DIGIT / ALPHA
      ; any VCHAR, except delimiters
```

# カンマ区切り

一部の HTTP ヘッダはカンマで複数の値を区切ることができる。これについての ABNF のルールが下記の RFC に記載されている。<br>
https://datatracker.ietf.org/doc/html/rfc7230#section-7

`#` が使われている ABNF がこれに該当し、例えば Accept ヘッダの定義で使われている。<br>
https://datatracker.ietf.org/doc/html/rfc7231#section-5.3.2

```
Accept = #( media-range [ accept-params ] )
```

これは `media-range [ accept-params ]` の部分をカンマ区切りで 1 つ以上記載できるという意味になる。

カンマによって区切ることで、そのヘッダは「リスト」として扱われる。

```
Accept: text/plain; q=0.5, text/html, text/x-dvi; q=0.8, text/x-c
```

上記のようなヘッダは概ね以下のように解釈されるはず。

```
Accept: text/plain; q=0.5
Accept: text/html
Accept: text/x-dvi; q=0.8
Accept: text/x-c
```

# Forwarded ヘッダ

https://datatracker.ietf.org/doc/html/rfc7239
