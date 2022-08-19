"use strict";function cyrToLat(e){const n={"а":"a","А":"A","б":"b","Б":"B","в":"v","В":"V","г":"g","Г":"G","д":"d","Д":"D","е":"e","Е":"E","ё":"e","Ё":"E","ж":"zh","Ж":"Zh","з":"z","З":"Z","и":"i","И":"I","й":"y","Й":"Y","к":"k","К":"K","л":"l","Л":"L","м":"m","М":"M","н":"n","Н":"N","о":"o","О":"O","п":"p","П":"P","р":"r","Р":"R","с":"s","С":"S","т":"t","Т":"T","у":"u","У":"U","ф":"f","Ф":"F","х":"kh","Х":"Kh","ц":"tz","Ц":"Tz","ч":"ch","Ч":"Ch","ш":"sh","Ш":"Sh","щ":"sch","Щ":"Sch","ы":"y","Ы":"Y","э":"e","Э":"E","ю":"iu","Ю":"Iu","я":"ia","Я":"Ia","ь":"","Ь":"","ъ":"","Ъ":"","ї":"yi","Ї":"Yi","і":"i","І":"I","ґ":"g","Ґ":"G","є":"e","Є":"E"};return e.split("").map((function(e){return n[e]||e})).join("")}function slug(e,n){var r;n=null!==(r=n)&&void 0!==r?r:"-";const t=new RegExp("[^A-Za-z0-9"+n+"]+","g"),c=new RegExp("["+n+"]+","g"),a=new RegExp("^"+n),i=new RegExp(n+"$");return cyrToLat(e).replaceAll(t,n).replaceAll(c,n).replace(a,"").replace(i,"").toLowerCase()}