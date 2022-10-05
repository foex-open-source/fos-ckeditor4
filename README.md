## FOS - CKEditor4

![](https://img.shields.io/badge/Plug--in_Type-Item-orange.svg) ![](https://img.shields.io/badge/APEX-19.2-success.svg) ![](https://img.shields.io/badge/APEX-20.1-success.svg) ![](https://img.shields.io/badge/APEX-20.2-success.svg) ![](https://img.shields.io/badge/APEX-21.1-success.svg) ![](https://img.shields.io/badge/APEX-21.2-success.svg) ![](https://img.shields.io/badge/APEX-22.1-success.svg)

Rich Text Editor based on the classic widget CKEditor4.
<h4>Free Plug-in under MIT License</h4>
<p>
All FOS plug-ins are released under MIT License, which essentially means it is free for everyone to use, no matter if commercial or private use.
</p>
<h4>Overview</h4>
<p>This plug-in offers the classic Rich Text Editor functionality we're all used to in APEX with minor differences such as a newer refreshed theme.</p>
<p>Starting in APEX 20.2, the APEX RTE has been upgraded to CKEditor5, which is a complete rewrite of the widget, its API is incompatible with the old version, and notably lacks certain features such as the View Source mode. This plug-in is for those who rely heavily on the features of CKE4 which are not yet part of CKE5.</p>
<p>It is generally recommended to upgrade to CKE5 and use the native APEX RTE. If that's not possible for your business case, you can use this plug-in instead. Officially, CKEditor4 will still be supported by its creators until 2023.</p>
<p>This plug-in is almost identical to the classic Rich Text Editor of APEX, so it can be a drop-in replacement for APEX 20.2 and above.</p>
<p>The main differences are:<p>
<ul>
<li>The default theme is now the newer "Moono-Lisa" which offers a more modern, flat design.</li>
<li>The library is loaded from the official CKEditor CDN, but you can also host it yourself, and reference the path in a Component Setting.</li>
<li>The editor's width is now responsive via CSS, not JavaScript, which removes jittering when resizing.</li>
</ul>

## License

MIT

