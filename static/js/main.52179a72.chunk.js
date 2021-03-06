(this["webpackJsonpfirebird-react"]=this["webpackJsonpfirebird-react"]||[]).push([[0],{15:function(e,t,a){e.exports={border:"MessengerMain_border__3eDiz",MessengerMain:"MessengerMain_MessengerMain__G_my1",image:"MessengerMain_image__3aedM",input:"MessengerMain_input__1o1aS",scroll:"MessengerMain_scroll__1Ov-f",header:"MessengerMain_header__2ce5m",empty:"MessengerMain_empty__M478O",ncscenter:"MessengerMain_ncscenter__1KKtL",MessageView:"MessengerMain_MessageView__-1IED",receiver:"MessengerMain_receiver__3XNND",reimage:"MessengerMain_reimage__2S8mA",sender:"MessengerMain_sender__1Wrs9"}},16:function(e,t,a){e.exports={border:"Contacts_border__Sf04J",Contacts:"Contacts_Contacts__3HDS0",search:"Contacts_search__3nW0o",btn:"Contacts_btn__3rFk_",list:"Contacts_list__2UyNX",vh60:"Contacts_vh60__2AyiT",ncpfcenter:"Contacts_ncpfcenter__3ZrMW",ContactView:"Contacts_ContactView__16gQn",userIcon:"Contacts_userIcon__1i6OM",contactSelected:"Contacts_contactSelected__2TcW-"}},176:function(e,t,a){e.exports={border:"Notifier_border__3db_T",Notifier:"Notifier_Notifier__2a7dZ"}},182:function(e,t,a){},20:function(e,t,a){e.exports={border:"Login_border__1D4hz",Login:"Login_Login__WctD9",loginContainer:"Login_loginContainer__2sYHN",loginForm:"Login_loginForm__2Maah",formMain:"Login_formMain__3rcaN",loginHeader:"Login_loginHeader__12uTQ",banner:"Login_banner__ZQscA",error:"Login_error__1hpMK",submitbtn:"Login_submitbtn__2BgvP"}},21:function(e,t,a){e.exports={border:"Messenger_border__2RQFR",Messenger:"Messenger_Messenger__1OLXO",messengerContainer:"Messenger_messengerContainer__22qNZ",cborder:"Messenger_cborder__1xE_B",sidenav:"Messenger_sidenav__m8nZf",header:"Messenger_header__1xa1v",logout:"Messenger_logout__35j93",sidenavIcon:"Messenger_sidenavIcon__1kRWm"}},242:function(e,t){},244:function(e,t){},254:function(e,t){},256:function(e,t){},283:function(e,t){},285:function(e,t){},286:function(e,t){},291:function(e,t){},293:function(e,t){},299:function(e,t){},301:function(e,t){},320:function(e,t){},332:function(e,t){},335:function(e,t){},356:function(e,t,a){"use strict";a.r(t);var s=a(4),r=a.n(s),n=a(91),c=a.n(n),i=(a(182),a(11)),o=a(19),u=a(1),l=a(7),b=a.n(l),d=a(18),m=a(174),p=a.n(m),j=a(175),h="user.",O="group.",g=".private.key",f=".public.key",v=".contacts",x="session.key",N="text",y="image",_="message_pending",S="message_sent",k="message_failed",C=a.n(j).a.create({baseURL:"http://35.222.126.184",timeout:1e3}),E=a(176),w=a.n(E),K=a(92),A=a.n(K),T=a(0),I={open:function(){},set:function(e){}},L={content:{top:"50%",left:"50%",right:"auto",bottom:"auto",marginRight:"-50%",transform:"translate(-50%, -50%)"},overlay:{backgroundColor:"rgba(0, 0, 0, 0.5)"}};A.a.setAppElement("#root");var R=function(e){I.set(e),I.open()},D=function(){var e=Object(s.useState)(!1),t=Object(i.a)(e,2),a=t[0],r=t[1],n=Object(s.useState)(""),c=Object(i.a)(n,2),o=c[0],u=c[1];return I.open=function(){r(!0)},I.set=u,Object(T.jsx)(A.a,{isOpen:a,onRequestClose:function(){r(!1)},style:L,contentLabel:"firebird: notification",children:Object(T.jsx)("div",{className:w.a.Notifier,children:Object(T.jsxs)("div",{className:"modal-content",children:[Object(T.jsx)("h3",{children:"Something went wrong :("}),Object(T.jsx)("h6",{children:o})]})})})},G=a(15),U=a.n(G),F={LOAD_RSA_KEYS:"LOAD_RSA_KEYS",SIGN_IN:"SIGN_IN",SIGN_UP:"SIGN_UP",LOAD_USER_LOCAL_STATE:"LOAD_USER_LOCAL_STATE",UPDATE_CONTACTS:"UPDATE_CONTACTS",SET_RECEIVER:"SET_RECEIVER",LOGOUT:"LOGOUT",NEW_MESSAGE:"NEW_MESSAGE",SEND_NEW_MESSAGE:"SEND_NEW_MESSAGE",SET_ACK_FLAG:"SET_ACK_FLAG"},W=a(9),P=a.n(W),J=a(51),V=a.n(J),H=p()("35.222.126.184"),B=function(e,t){if(e.receiver.startsWith(O)||e.type!==N)return Object(u.a)({},e);if(!t)return R("Invalid public key from sender."),Object(u.a)({},e);try{var a=(new V.a).importKey(t,"public"),s=Object(u.a)({},e);return s.body=a.encrypt(s.body,"base64"),s}catch(r){return R("Invalid public key from sender."),Object(u.a)({},e)}},Y=function(e,t,a,s){var r=Object(o.a)(e);return t.forEach((function(e){if(e.receiver&&e.receiver.startsWith(O)){var t=r.findIndex((function(t){return q(t.user)&&t.user.groupName===e.receiver}));if(-1===t){var n={groupName:e.receiver,members:[]};r.push({user:n,messages:[Object(u.a)({},e)]})}else r[t].messages.push(e)}else if(e.receiver&&"user.firebird"===e.receiver);else{e=function(e,t){if(e.receiver.startsWith(O)||e.type!==N)return Object(u.a)({},e);if(!t)return Object(u.a)({},e);try{var a=(new V.a).importKey(t,"private"),s=Object(u.a)({},e);return s.body=a.decrypt(s.body,"utf8"),s}catch(r){return R("Invalid private key."),Object(u.a)({},e)}}(e,a);var c=r.findIndex((function(t){return Q(t.user)&&t.user.userName===(s?e.receiver:e.sender)}));if(-1===c){var i={userName:s?e.receiver:e.sender,publicKey:null,active:!1};r.push({user:i,messages:[Object(u.a)({},e)]})}else r[c].messages.push(e)}})),r},Z=function(){var e=Object(s.useContext)(te),t=e.state,a=e.dispatch,r=Object(s.useState)(""),n=Object(i.a)(r,2),c=n[0],l=n[1],m=Object(s.useState)(null),p=Object(i.a)(m,2),j=p[0],O=p[1];Object(s.useEffect)((function(){!function(){var e=document.getElementById("scrolldiv");e&&(e.scrollTop=e.scrollHeight)}()}),[t.contacts]);var g=t.currentReceiver&&0!==t.contacts.filter((function(e){return!(!Q(e.user)||e.user.userName!==t.currentReceiver)||!(!q(e.user)||e.user.groupName!==t.currentReceiver)})).length,f=function(e,s){var r=Date.now(),n={timestamp:Date.now(),id:P.a.createHash("sha256").update(r+"."+t.auth.userName).digest("hex"),type:s,sender:t.auth.userName?t.auth.userName:"",receiver:t.currentReceiver?t.currentReceiver:"",body:e,status:_},c=null,i=t.contacts.filter((function(e){return!(!Q(e.user)||e.user.userName!==t.currentReceiver)}));i.length&&Q(i[0].user)&&(c=i[0].user.publicKey),H.emit("send_message",JSON.stringify({userName:t.auth.userName,sessionKey:t.auth.sessionKey,message:Object(u.a)(Object(u.a)({},B(n,c)),{},{status:void 0})})),a({type:F.SEND_NEW_MESSAGE,payload:n}),l("")};Object(s.useEffect)((function(){return H.connected||H.connect(),H.emit("new_connection",JSON.stringify({userName:t.auth.userName,sessionKey:t.auth.sessionKey})),H.on("recv_message",(function(e){var t=JSON.parse(e);a({type:F.NEW_MESSAGE,payload:t})})),H.on("ack_message",(function(e){var t=JSON.parse(e);a({type:F.SET_ACK_FLAG,payload:t})})),H.on("user_state_change",(function(e){console.log("user_state_change: "+e)})),function(){H.close()}}),[]),Object(s.useEffect)((function(){(function(){var e=Object(d.a)(b.a.mark((function e(){var s,r,n,c,i;return b.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!t.auth.userName||!t.auth.sessionKey){e.next=25;break}return e.prev=1,e.next=4,C.get("/api/pendingMessages?userName=".concat(t.auth.userName,"&sessionKey=").concat(t.auth.sessionKey));case 4:s=e.sent,r=s.data.messageList,n=localStorage.getItem(t.auth.userName+v),c=n?JSON.parse(n):[],i=Y(c,r,t.auth.privateKey,!1),a({type:F.UPDATE_CONTACTS,payload:i}),e.next=25;break;case 12:if(e.prev=12,e.t0=e.catch(1),!e.t0.response){e.next=24;break}e.t1=e.t0.response.status,e.next=401===e.t1?18:20;break;case 18:return R("Session key may have expired, please login again."),e.abrupt("break",22);case 20:return R("Something went wrong. Try again."),e.abrupt("break",22);case 22:e.next=25;break;case 24:R("Could not contact contact server.");case 25:case"end":return e.stop()}}),e,null,[[1,12]])})));return function(){return e.apply(this,arguments)}})()()}),[a,t.auth.sessionKey,t.auth.userName,t.auth.privateKey]);var x=new FileReader;x.addEventListener("load",(function(){x.result&&O(x.result.toString())})),Object(s.useEffect)((function(){j&&(f(j,y),O(null))}),[j]);var E;return Object(T.jsxs)("div",{className:U.a.MessengerMain,children:[g?Object(T.jsx)("div",{className:U.a.header+" row",children:Object(T.jsx)("div",{className:"col s12",children:Object(T.jsx)("h5",{children:t.currentReceiver})})}):"",Object(T.jsx)("div",{className:"row",children:g?Object(T.jsx)("div",{id:"scrolldiv",className:U.a.scroll+" col s12",children:(E=t.contacts.filter((function(e){return!(!Q(e.user)||e.user.userName!==t.currentReceiver)||!(!q(e.user)||e.user.groupName!==t.currentReceiver)}))[0].messages,Object(o.a)(new Map(E.map((function(e){return[e.id,e]}))).values())).map((function(e,a){var s=function(){var t=Object(T.jsx)(T.Fragment,{});switch(e.status){case _:t=Object(T.jsx)("i",{className:"material-icons",children:"access_time"});break;case k:t=Object(T.jsx)("i",{className:"material-icons",children:"error"});break;case S:t=Object(T.jsx)("i",{className:"material-icons",children:"check_circle"})}var a=Object(T.jsx)(T.Fragment,{});return e.type===N&&"string"===typeof e.body?a=Object(T.jsx)(T.Fragment,{children:e.body}):e.type===y&&"string"===typeof e.body&&(a=Object(T.jsx)(T.Fragment,{children:Object(T.jsx)("img",{className:U.a.image+" materialboxed",src:e.body,alt:"<>img data not loaded</>"})})),Object(T.jsxs)(T.Fragment,{children:[Object(T.jsxs)("p",{children:[Object(T.jsx)("i",{className:"material-icons",children:"account_circle"}),Object(T.jsx)("small",{children:e.sender.replace(h,"")})]}),Object(T.jsx)("p",{children:a}),Object(T.jsxs)("p",{children:[Object(T.jsx)("small",{children:new Date(e.timestamp).toISOString()}),Object(T.jsx)("small",{className:"right",children:t})]})]})};return Object(T.jsx)("div",{className:U.a.MessageView,children:Object(T.jsx)("div",{className:"row",children:e.sender!==t.auth.userName?Object(T.jsx)("div",{className:U.a.receiver+" "+(e.type===y?U.a.reimage:"")+" col l5 s8",children:Object(T.jsx)(s,{})}):Object(T.jsx)("div",{className:U.a.sender+" col l5 s8 offset-l7  offset-s4",children:Object(T.jsx)(s,{})})})},a)}))}):Object(T.jsx)("div",{className:U.a.empty+" col s12 valign-wrapper center-align",children:Object(T.jsx)("div",{className:U.a.ncscenter,children:Object(T.jsx)("h6",{children:"No contact selected."})})})}),g?Object(T.jsx)("div",{className:U.a.input+" row",children:Object(T.jsx)("div",{className:"col s12",children:Object(T.jsxs)("div",{className:"row",children:[Object(T.jsxs)("div",{className:"col s8 l10 input-field",children:[Object(T.jsx)("input",{id:"main-text-send",type:"text",className:"validate",value:c,onChange:function(e){l(e.target.value)}}),Object(T.jsx)("label",{htmlFor:"main-text-send",children:"Type a message"})]}),Object(T.jsx)("div",{className:"col l1 s2 center",children:Object(T.jsx)("button",{className:"btn",onClick:function(){t.currentReceiver&&f(c,N)},children:Object(T.jsx)("i",{className:"material-icons",children:"send"})})}),Object(T.jsxs)("div",{className:"col l1 s2 center",children:[Object(T.jsx)("input",{id:"imgupload",type:"file",hidden:!0,onChange:function(e){e.target.files&&e.target.files.length?x.readAsDataURL(e.target.files[0]):O(null)}}),Object(T.jsx)("button",{className:"btn",onClick:function(){var e=document.getElementById("imgupload");e&&e.click()},children:Object(T.jsx)("i",{className:"material-icons",children:"add_a_photo"})})]})]})})}):""]})},Q=function(e){return"userName"in e&&"publicKey"in e&&"active"in e},q=function(e){return"groupName"in e&&"members"in e},X={auth:{userName:null,sessionKey:null,privateKey:null,publicKey:null,hash:null},contacts:[],currentReceiver:null},z=Object(s.createContext)({state:X,dispatch:function(){return null}}),$=function(e,t){switch(t.type){case F.SIGN_UP:return localStorage.setItem(t.payload.userName+g,t.payload.privateKey),localStorage.setItem(t.payload.userName+f,t.payload.publicKey),Object(u.a)(Object(u.a)({},e),{},{auth:Object(u.a)(Object(u.a)({},e.auth),t.payload)});case F.LOAD_RSA_KEYS:case F.SIGN_IN:return Object(u.a)(Object(u.a)({},e),{},{auth:Object(u.a)(Object(u.a)({},e.auth),t.payload)});case F.LOAD_USER_LOCAL_STATE:return Object(u.a)(Object(u.a)({},e),{},{contacts:Object(o.a)(t.payload)});case F.UPDATE_CONTACTS:return localStorage.setItem(e.auth.userName+v,JSON.stringify(t.payload)),Object(u.a)(Object(u.a)({},e),{},{contacts:Object(o.a)(t.payload)});case F.SET_RECEIVER:var a=e.contacts.map((function(e){return Q(e.user)&&e.user.userName===t.payload.currentReceiver?Object(u.a)(Object(u.a)({},e),{},{user:Object(u.a)(Object(u.a)({},e.user),{},{publicKey:t.payload.publicKey?t.payload.publicKey:e.user.publicKey,active:t.payload.active})}):q(e.user)&&e.user.groupName===t.payload.currentReceiver?Object(u.a)(Object(u.a)({},e),{},{user:Object(u.a)(Object(u.a)({},e.user),{},{members:Object(o.a)(t.payload.members)})}):e}));return localStorage.setItem(e.auth.userName+v,JSON.stringify(a)),Object(u.a)(Object(u.a)({},e),{},{currentReceiver:t.payload.currentReceiver,contacts:a});case F.NEW_MESSAGE:var s=Y(e.contacts,[t.payload],e.auth.privateKey,!1);return localStorage.setItem(e.auth.userName+v,JSON.stringify(s)),Object(u.a)(Object(u.a)({},e),{},{contacts:Object(o.a)(s)});case F.SEND_NEW_MESSAGE:var r=Y(e.contacts,[t.payload],null,!0);return localStorage.setItem(e.auth.userName+v,JSON.stringify(r)),Object(u.a)(Object(u.a)({},e),{},{contacts:Object(o.a)(r)});case F.SET_ACK_FLAG:var n=e.contacts.map((function(e){return Object(u.a)(Object(u.a)({},e),{},{messages:e.messages.map((function(e){return e.id===t.payload.id?Object(u.a)(Object(u.a)({},e),{},{status:t.payload.body?S:k}):e}))})}));return localStorage.setItem(e.auth.userName+v,JSON.stringify(n)),Object(u.a)(Object(u.a)({},e),{},{contacts:Object(o.a)(n)});case F.LOGOUT:return sessionStorage.removeItem(x),Object(u.a)(Object(u.a)({},e),{},{auth:Object(u.a)(Object(u.a)({},e.auth),{},{sessionKey:t.payload})});default:return e}},ee=function(e){var t=Object(s.useReducer)($,X),a=Object(i.a)(t,2),r=a[0],n=a[1];return Object(T.jsx)(z.Provider,{value:{state:r,dispatch:n},children:e.children})},te=z,ae=a(20),se=a.n(ae),re=function(){var e=Object(s.useContext)(te),t=e.state,a=e.dispatch,r=Object(s.useState)(""),n=Object(i.a)(r,2),c=n[0],o=n[1],l=Object(s.useState)(""),m=Object(i.a)(l,2),p=m[0],j=m[1];Object(s.useEffect)((function(){var e=localStorage.getItem(h+c+g),t=localStorage.getItem(h+c+f);if(e&&t){var s=P.a.createHash("sha256").update(e).digest("hex");a({type:F.LOAD_RSA_KEYS,payload:{privateKey:e,publicKey:t,hash:s}})}else a({type:F.LOAD_RSA_KEYS,payload:{privateKey:null,publicKey:null,hash:null}})}),[a,c]);var O=function(){var e=Object(d.a)(b.a.mark((function e(s){var r,n;return b.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(s.preventDefault(),j(""),!(r=t.auth.hash)){e.next=27;break}return e.prev=4,j("Signing you in..."),e.next=8,C.post("/api/validateUser",{userName:h+c,hash:r});case 8:n=e.sent,sessionStorage.setItem(x,JSON.stringify(Object(u.a)(Object(u.a)({},t.auth),{},{sessionKey:n.data.sessionKey,userName:n.data.userName}))),a({type:F.SIGN_IN,payload:{userName:n.data.userName,sessionKey:n.data.sessionKey}}),e.next=25;break;case 13:if(e.prev=13,e.t0=e.catch(4),!e.t0.response){e.next=24;break}e.t1=e.t0.response.status,e.next=401===e.t1?19:21;break;case 19:return j("Authentication failed."),e.abrupt("break",22);case 21:j("Something went wrong. Try again.");case 22:e.next=25;break;case 24:j("Could not contact server. Try again.");case 25:e.next=28;break;case 27:j("RSA credentials not found in local storage.");case 28:case"end":return e.stop()}}),e,null,[[4,13]])})));return function(t){return e.apply(this,arguments)}}(),v=function(){var e=Object(d.a)(b.a.mark((function e(t){var s,r,n,i,o;return b.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t.preventDefault(),j(""),s=new V.a({b:512}),r=s.exportKey("public"),n=s.exportKey("private"),i=P.a.createHash("sha256").update(n).digest("hex"),e.prev=6,j("Creating new user..."),e.next=10,C.post("/api/createUser",{userName:h+c,hash:i,publicKey:r});case 10:o=e.sent,a({type:F.SIGN_UP,payload:{userName:o.data.userName,privateKey:n,publicKey:r,hash:i}}),j("User created."),e.next=27;break;case 15:if(e.prev=15,e.t0=e.catch(6),!e.t0.response){e.next=26;break}e.t1=e.t0.response.status,e.next=401===e.t1?21:23;break;case 21:return j("User already exists."),e.abrupt("break",24);case 23:j("Something went wrong. Try again.");case 24:e.next=27;break;case 26:j("Could not contact server. Try again.");case 27:case"end":return e.stop()}}),e,null,[[6,15]])})));return function(t){return e.apply(this,arguments)}}();return Object(T.jsx)("div",{className:se.a.Login,children:Object(T.jsxs)("div",{className:se.a.loginContainer+" row",children:[Object(T.jsx)("div",{className:se.a.banner+" col l8 m6 hide-on-small-only valign-wrapper",children:Object(T.jsxs)("div",{className:"col m11 offset-m1",children:[Object(T.jsx)("h1",{children:"Introducing firebird."}),Object(T.jsx)("h5",{children:"A Fast end-to-end Encrypted Messenger"}),Object(T.jsxs)("p",{children:["No more remembering passwords. ",Object(T.jsx)("br",{}),"Password-less authentication using asymmetric key pairs for one tap ",Object(T.jsx)("br",{}),"login and signing up. ",Object(T.jsx)("br",{})]}),Object(T.jsxs)("p",{children:["All user information is persisted client-side. ",Object(T.jsx)("br",{})]})]})}),Object(T.jsx)("div",{className:se.a.loginForm+" col l4 m6 s12 valign-wrapper",children:Object(T.jsxs)("form",{className:se.a.formMain,children:[Object(T.jsxs)("div",{className:se.a.loginHeader+" row",children:[Object(T.jsx)("h1",{children:"firebird"}),Object(T.jsx)("h6",{children:"Secured by RSA end-to-end Encryption"})]}),Object(T.jsx)("div",{className:"row",children:Object(T.jsxs)("div",{className:"input-field col s8 offset-s2",children:[Object(T.jsx)("input",{id:"user",type:"text",className:"validate",onChange:function(e){o(e.target.value),j("")},value:c}),Object(T.jsx)("label",{htmlFor:"user",children:"Username: "}),Object(T.jsx)("span",{className:se.a.error+" helper-text",children:p})]})}),Object(T.jsxs)("div",{className:"row",children:[Object(T.jsx)("div",{className:"col m3 offset-m3 s4 offset-s2 center",children:Object(T.jsx)("button",{className:se.a.submitbtn+" btn",onClick:O,children:"Sign In"})}),Object(T.jsx)("div",{className:"col m3 s4 center",children:Object(T.jsx)("button",{className:se.a.submitbtn+" btn",onClick:v,children:"Sign Up"})})]})]})})]})})},ne=a(16),ce=a.n(ne),ie=function(e){var t=Object(s.useContext)(te),a=t.state,r=t.dispatch,n=Object(s.useState)(""),c=Object(i.a)(n,2),o=c[0],u=c[1],l=Object(s.useState)(a.contacts),m=Object(i.a)(l,2),p=m[0],j=m[1];Object(s.useEffect)((function(){var e=a.contacts.filter((function(e){return!(!Q(e.user)||!e.user.userName.startsWith(h+o))||!(!q(e.user)||!e.user.groupName.startsWith(O+o))}));j(e)}),[a.contacts,o]);var g=function(){var e=Object(d.a)(b.a.mark((function e(t){var s,n,c;return b.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t=h+t,!a.contacts.filter((function(e){return Q(e.user)&&e.user.userName===t})).length){e.next=4;break}return e.abrupt("return");case 4:return e.prev=4,e.next=7,C.get("/api/publicKey?userName=".concat(a.auth.userName,"&sessionKey=").concat(a.auth.sessionKey,"&user=").concat(t));case 7:s=e.sent,n={user:{userName:t,publicKey:s.data.publicKey,active:!1},messages:[]},(c=a.contacts).push(n),r({type:F.UPDATE_CONTACTS,payload:c}),u(""),e.next=27;break;case 15:if(e.prev=15,e.t0=e.catch(4),!e.t0.response){e.next=26;break}e.t1=e.t0.response.status,e.next=401===e.t1?21:23;break;case 21:return R("Invalid username."),e.abrupt("break",24);case 23:R("Something went wrong. Try again.");case 24:e.next=27;break;case 26:R("Could not contact server. Try again.");case 27:case"end":return e.stop()}}),e,null,[[4,15]])})));return function(t){return e.apply(this,arguments)}}(),f=function(){var e=Object(d.a)(b.a.mark((function e(t){var s,n,c,i,o,u,l,d;return b.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(s=!1,n=null,c=[],!(i=a.contacts.filter((function(e){return!(!Q(e.user)||e.user.userName!==t)||!(!q(e.user)||e.user.groupName!==t)}))).length){e.next=67;break}if(o=i[0],!Q(o.user)){e.next=48;break}if(o.user.publicKey){e.next=27;break}return e.prev=8,e.next=11,C.get("/api/publicKey?userName=".concat(a.auth.userName,"&sessionKey=").concat(a.auth.sessionKey,"&user=").concat(t));case 11:u=e.sent,n=u.data.publicKey,e.next=27;break;case 15:if(e.prev=15,e.t0=e.catch(8),!e.t0.response){e.next=26;break}e.t1=e.t0.response,e.next=401===e.t1?21:23;break;case 21:return R("Session key may have expired, please login again."),e.abrupt("break",24);case 23:R("Something went wrong. Try again.");case 24:e.next=27;break;case 26:R("Could not contact contact server.");case 27:return e.prev=27,e.next=30,C.get("/api/userActive?userName=".concat(a.auth.userName,"&sessionKey=").concat(a.auth.sessionKey,"&user=").concat(t));case 30:l=e.sent,s=l.data.active,e.next=46;break;case 34:if(e.prev=34,e.t2=e.catch(27),!e.t2.response){e.next=45;break}e.t3=e.t2.response,e.next=401===e.t3?40:42;break;case 40:return R("Session key may have expired, please login again."),e.abrupt("break",43);case 42:R("Something went wrong. Try again.");case 43:e.next=46;break;case 45:R("Could not contact contact server.");case 46:e.next=67;break;case 48:return e.prev=48,e.next=51,C.get("/api/groupMembers?userName=".concat(a.auth.userName,"&sessionKey=").concat(a.auth.sessionKey,"&groupName=").concat(t));case 51:d=e.sent,c=d.data.groupMembers,e.next=67;break;case 55:if(e.prev=55,e.t4=e.catch(48),!e.t4.response){e.next=66;break}e.t5=e.t4.response,e.next=401===e.t5?61:63;break;case 61:return R("Session key may have expired, please login again."),e.abrupt("break",64);case 63:R("Something went wrong. Try again.");case 64:e.next=67;break;case 66:R("Could not contact contact server.");case 67:r({type:F.SET_RECEIVER,payload:{currentReceiver:t,active:s,publicKey:n,members:c}});case 68:case"end":return e.stop()}}),e,null,[[8,15],[27,34],[48,55]])})));return function(t){return e.apply(this,arguments)}}(),v=function(){var e=Object(d.a)(b.a.mark((function e(t){var s,n,c;return b.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=O+t,e.prev=1,e.next=4,C.post("/api/createGroup",{userName:a.auth.userName,sessionKey:a.auth.sessionKey,groupName:t});case 4:s=e.sent,n={groupName:s.data.groupName,members:[]},a.auth.userName&&n.members.push(a.auth.userName),(c=a.contacts).push({user:n,messages:[]}),r({type:F.UPDATE_CONTACTS,payload:c}),u(""),e.next=25;break;case 13:if(e.prev=13,e.t0=e.catch(1),!e.t0.response){e.next=24;break}e.t1=e.t0.response.status,e.next=401===e.t1?19:21;break;case 19:return R("Group already exists."),e.abrupt("break",22);case 21:R("Something went wrong. Try again.");case 22:e.next=25;break;case 24:R("Could not contact server. Try again.");case 25:case"end":return e.stop()}}),e,null,[[1,13]])})));return function(t){return e.apply(this,arguments)}}(),x=function(){var e=Object(d.a)(b.a.mark((function e(t){var s,n,c,i;return b.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t=O+t,!a.contacts.filter((function(e){return q(e.user)&&e.user.groupName===t})).length){e.next=4;break}return e.abrupt("return");case 4:return e.prev=4,e.next=7,C.post("/api/joinGroup",{userName:a.auth.userName,sessionKey:a.auth.sessionKey,groupName:t});case 7:return s=e.sent,e.next=10,C.get("/api/groupMembers?userName=".concat(a.auth.userName,"&groupName=").concat(t,"&sessionKey=").concat(a.auth.sessionKey));case 10:n=e.sent,c={groupName:s.data.groupName,members:n.data.groupMembers},(i=a.contacts).push({user:c,messages:[]}),r({type:F.UPDATE_CONTACTS,payload:i}),u(""),e.next=30;break;case 18:if(e.prev=18,e.t0=e.catch(4),!e.t0.response){e.next=29;break}e.t1=e.t0.response.status,e.next=401===e.t1?24:26;break;case 24:return R("Group does not exist"),e.abrupt("break",27);case 26:R("Something went wrong. Try again.");case 27:e.next=30;break;case 29:R("Could not contact server. Try again.");case 30:case"end":return e.stop()}}),e,null,[[4,18]])})));return function(t){return e.apply(this,arguments)}}(),N=function(e,t,s){return Object(T.jsx)("li",{className:ce.a.ContactView,children:Object(T.jsx)("div",{children:Object(T.jsxs)("button",{className:(s?ce.a.contactSelected:"")+" btn",onClick:function(){f(Q(e.user)?e.user.userName:e.user.groupName)},children:[Object(T.jsx)("i",{className:ce.a.userIcon+" large material-icons left",children:Q(e.user)?"account_circle":"group"}),Q(e.user)?e.user.userName.replace(h,""):e.user.groupName.replace(O,""),Object(T.jsx)("a",{className:"right",href:"#react",onClick:function(){return function(e){var t=a.contacts.filter((function(t){return(!Q(t.user)||t.user.userName!==e)&&(!q(t.user)||t.user.groupName!==e)}));r({type:F.UPDATE_CONTACTS,payload:t})}(Q(e.user)?e.user.userName:e.user.groupName)},children:Object(T.jsx)("i",{className:"material-icons",children:"close"})})]})})},t)};return Object(T.jsx)("div",{className:ce.a.Contacts,children:Object(T.jsx)("div",{className:"row",children:Object(T.jsxs)("div",{className:"col s12",children:[Object(T.jsx)("div",{className:"row",children:Object(T.jsxs)("div",{className:"col s12 m10 offset-m1 input-field",children:[Object(T.jsx)("i",{className:"material-icons prefix",children:"search"}),Object(T.jsx)("input",{id:e.name,type:"text",className:"validate",onChange:function(e){u(e.target.value)},value:o}),Object(T.jsx)("label",{htmlFor:e.name,children:"Search or add new contacts"})]})}),Object(T.jsx)("div",{className:ce.a.borderbtm+" row",children:Object(T.jsx)("div",{className:"col s12 m10 offset-m1",children:Object(T.jsxs)("div",{className:"row",children:[Object(T.jsx)("div",{className:"col s4 center",children:Object(T.jsx)("button",{type:"button",className:ce.a.btn+" btn btn-small",onClick:function(){g(o)},children:"Add Contact"})}),Object(T.jsx)("div",{className:"col s4 center",children:Object(T.jsx)("button",{type:"button",className:ce.a.btn+" btn btn-small",onClick:function(){return v(o)},children:"Create Group"})}),Object(T.jsx)("div",{className:"col s4 center",children:Object(T.jsx)("button",{type:"button",className:ce.a.btn+" btn btn-small",onClick:function(){return x(o)},children:"Join Group"})})]})})}),Object(T.jsx)("ul",{className:ce.a.list,children:p.length?p.map((function(e,t){return N(e,t,a.currentReceiver===(Q(e.user)?e.user.userName:e.user.groupName))})):Object(T.jsx)("div",{className:ce.a.vh60+" valign-wrapper center-align",children:Object(T.jsx)("div",{className:ce.a.ncpfcenter,children:Object(T.jsx)("h6",{children:"No contacts for applied filter"})})})})]})})})},oe=a(21),ue=a.n(oe),le=function(){var e=Object(s.useContext)(te).dispatch,t=function(){document.querySelectorAll(".tooltipped").forEach((function(e){M.Tooltip.getInstance(e).close()})),e({type:F.LOGOUT,payload:null})};return Object(T.jsxs)("div",{className:ue.a.Messenger,children:[Object(T.jsx)("div",{className:"hide-on-med-and-up",children:Object(T.jsxs)("div",{id:"slide-out",className:ue.a.sidenav+" sidenav",children:[Object(T.jsxs)("div",{className:ue.a.header+" row",children:[Object(T.jsx)("div",{className:"col m11 s10",children:Object(T.jsx)("h2",{children:"firebird"})}),Object(T.jsx)("div",{className:ue.a.logout+" col  m1 s2",children:Object(T.jsx)("a",{href:"#react",className:"tooltipped","data-position":"bottom","data-tooltip":"Logout",onClick:t,children:Object(T.jsx)("i",{className:"material-icons",children:"exit_to_app"})})})]}),Object(T.jsx)(ie,{name:"sidenav"})]})}),Object(T.jsxs)("div",{className:ue.a.messengerContainer+" row",children:[Object(T.jsxs)("div",{className:ue.a.cborder+" col l4 m6 hide-on-small-only",children:[Object(T.jsxs)("div",{className:ue.a.header+" row",children:[Object(T.jsx)("div",{className:"col m11 s10",children:Object(T.jsx)("h2",{children:"firebird"})}),Object(T.jsx)("div",{className:ue.a.logout+" col m1 s2",children:Object(T.jsx)("a",{href:"#react",className:"tooltipped","data-position":"bottom","data-tooltip":"Logout",onClick:t,children:Object(T.jsx)("i",{className:"material-icons",children:"exit_to_app"})})})]}),Object(T.jsx)(ie,{name:"main"})]}),Object(T.jsxs)("div",{className:"col l8 m6 s12",children:[Object(T.jsx)("div",{className:ue.a.sidenavIcon+" row hide-on-med-and-up",children:Object(T.jsx)("a",{href:"#react","data-target":"slide-out",className:"sidenav-trigger",children:Object(T.jsx)("i",{className:"material-icons",children:"menu"})})}),Object(T.jsx)(Z,{})]})]})]})},be=a(177),de=a.n(be),me=function(){var e=Object(s.useContext)(te),t=e.state,a=e.dispatch;return Object(s.useEffect)((function(){de.a.AutoInit()})),Object(s.useEffect)((function(){var e=sessionStorage.getItem(x);if(e){var t=JSON.parse(e);a({type:F.SIGN_IN,payload:t})}}),[a]),Object(T.jsxs)(T.Fragment,{children:[t.auth.sessionKey?Object(T.jsx)(le,{}):Object(T.jsx)(re,{}),Object(T.jsx)(D,{})]})},pe=function(e){e&&e instanceof Function&&a.e(3).then(a.bind(null,357)).then((function(t){var a=t.getCLS,s=t.getFID,r=t.getFCP,n=t.getLCP,c=t.getTTFB;a(e),s(e),r(e),n(e),c(e)}))};c.a.render(Object(T.jsx)(r.a.StrictMode,{children:Object(T.jsx)(ee,{children:Object(T.jsx)(me,{})})}),document.getElementById("root")),pe()}},[[356,1,2]]]);
//# sourceMappingURL=main.52179a72.chunk.js.map