(this["webpackJsonpfirebird-react"]=this["webpackJsonpfirebird-react"]||[]).push([[0],{10:function(e,t,a){e.exports={border:"Contacts_border__Sf04J",Contacts:"Contacts_Contacts__3HDS0",btn:"Contacts_btn__3rFk_",r1:"Contacts_r1__CpBqT",search:"Contacts_search__3nW0o",r2:"Contacts_r2__22Y0p",welcome:"Contacts_welcome__3cnNw",list:"Contacts_list__2UyNX",vh60:"Contacts_vh60__2AyiT",ncpfcenter:"Contacts_ncpfcenter__3ZrMW",ContactView:"Contacts_ContactView__16gQn",fiberNewMargin:"Contacts_fiberNewMargin__1MTQ_",userIcon:"Contacts_userIcon__1i6OM",contactSelected:"Contacts_contactSelected__2TcW-"}},13:function(e,t,a){e.exports={border:"MessengerMain_border__3eDiz",MessengerMain:"MessengerMain_MessengerMain__G_my1",image:"MessengerMain_image__3aedM",header:"MessengerMain_header__2ce5m",activeIconMargin:"MessengerMain_activeIconMargin__35ekG",messageList:"MessengerMain_messageList__24Ksj",scroll:"MessengerMain_scroll__1Ov-f",input:"MessengerMain_input__1o1aS",empty:"MessengerMain_empty__M478O",ncscenter:"MessengerMain_ncscenter__1KKtL",MessageView:"MessengerMain_MessageView__-1IED",receiver:"MessengerMain_receiver__3XNND",reimage:"MessengerMain_reimage__2S8mA",sender:"MessengerMain_sender__1Wrs9"}},176:function(e,t,a){e.exports={border:"Notifier_border__3db_T",Notifier:"Notifier_Notifier__2a7dZ"}},182:function(e,t,a){},20:function(e,t,a){e.exports={border:"Login_border__1D4hz",Login:"Login_Login__WctD9",loginContainer:"Login_loginContainer__2sYHN",loginForm:"Login_loginForm__2Maah",formMain:"Login_formMain__3rcaN",loginHeader:"Login_loginHeader__12uTQ",banner:"Login_banner__ZQscA",error:"Login_error__1hpMK",submitbtn:"Login_submitbtn__2BgvP"}},21:function(e,t,a){e.exports={border:"Messenger_border__2RQFR",Messenger:"Messenger_Messenger__1OLXO",messengerContainer:"Messenger_messengerContainer__22qNZ",cborder:"Messenger_cborder__1xE_B",sidenav:"Messenger_sidenav__m8nZf",header:"Messenger_header__1xa1v",logout:"Messenger_logout__35j93",sidenavIcon:"Messenger_sidenavIcon__1kRWm"}},242:function(e,t){},244:function(e,t){},254:function(e,t){},256:function(e,t){},283:function(e,t){},285:function(e,t){},286:function(e,t){},291:function(e,t){},293:function(e,t){},299:function(e,t){},301:function(e,t){},320:function(e,t){},332:function(e,t){},335:function(e,t){},356:function(e,t,a){"use strict";a.r(t);var s=a(4),r=a.n(s),n=a(91),c=a.n(n),i=(a(182),a(12)),o=a(17),u=a(1),l=a(7),d=a.n(l),b=a(19),m=a(174),p=a.n(m),j=a(175),h="http://35.222.126.184",g="user.",O="group.",f=".private.key",v=".public.key",N=".contacts",x="session.key",_="text",y="image",S="message_pending",k="message_sent",C="message_failed",w=a.n(j).a.create({baseURL:h,timeout:1e3}),E=a(176),K=a.n(E),T=a(92),A=a.n(T),I=a(0),L={open:function(){},set:function(e){}},R={content:{top:"50%",left:"50%",right:"auto",bottom:"auto",marginRight:"-50%",transform:"translate(-50%, -50%)"},overlay:{backgroundColor:"rgba(0, 0, 0, 0.5)"}};A.a.setAppElement("#root");var D=function(e){L.set(e),L.open()},G=function(){var e=Object(s.useState)(!1),t=Object(i.a)(e,2),a=t[0],r=t[1],n=Object(s.useState)(""),c=Object(i.a)(n,2),o=c[0],u=c[1];return L.open=function(){r(!0)},L.set=u,Object(I.jsx)(A.a,{isOpen:a,onRequestClose:function(){r(!1)},style:R,contentLabel:"firebird: notification",children:Object(I.jsx)("div",{className:K.a.Notifier,children:Object(I.jsxs)("div",{className:"modal-content",children:[Object(I.jsx)("h3",{children:"Something went wrong :("}),Object(I.jsx)("h6",{children:o})]})})})},U=a(13),F=a.n(U),W={LOAD_RSA_KEYS:"LOAD_RSA_KEYS",SIGN_IN:"SIGN_IN",SIGN_UP:"SIGN_UP",LOAD_USER_LOCAL_STATE:"LOAD_USER_LOCAL_STATE",UPDATE_CONTACTS:"UPDATE_CONTACTS",SET_RECEIVER:"SET_RECEIVER",LOGOUT:"LOGOUT",NEW_MESSAGE:"NEW_MESSAGE",SEND_NEW_MESSAGE:"SEND_NEW_MESSAGE",SET_ACK_FLAG:"SET_ACK_FLAG"},J=a(9),P=a.n(J),V=a(51),H=a.n(V),B=p()(h,{transports:["websocket"]}),Y=function(e,t){if(e.receiver.startsWith(O)||e.type!==_)return Object(u.a)({},e);if(!t)return D("Invalid public key from sender."),Object(u.a)({},e);try{var a=(new H.a).importKey(t,"public"),s=Object(u.a)({},e);return s.body=a.encrypt(s.body,"base64"),s}catch(r){return D("Invalid public key from sender."),Object(u.a)({},e)}},Q=function(e,t,a,s){var r=Object(o.a)(e);return t.forEach((function(e){if(e.receiver&&e.receiver.startsWith(O)){var t=r.findIndex((function(t){return X(t.user)&&t.user.groupName===e.receiver}));if(-1===t){var n={groupName:e.receiver,members:[]};r.push({user:n,messages:[Object(u.a)({},e)],unread:!s})}else r[t].messages.push(e),r[t].unread=!s}else if(e.receiver&&"user.firebird"===e.receiver);else{e=function(e,t){if(e.receiver.startsWith(O)||e.type!==_)return Object(u.a)({},e);if(!t)return Object(u.a)({},e);try{var a=(new H.a).importKey(t,"private"),s=Object(u.a)({},e);return s.body=a.decrypt(s.body,"utf8"),s}catch(r){return D("Invalid private key."),Object(u.a)({},e)}}(e,a);var c=r.findIndex((function(t){return q(t.user)&&t.user.userName===(s?e.receiver:e.sender)}));if(-1===c){var i={userName:s?e.receiver:e.sender,publicKey:null,active:!1};r.push({user:i,messages:[Object(u.a)({},e)],unread:!s})}else r[c].messages.push(e),r[c].unread=!s}})),r},Z=function(){var e,t,a=Object(s.useContext)(ae),r=a.state,n=a.dispatch,c=Object(s.useState)(""),l=Object(i.a)(c,2),m=l[0],p=l[1],j=Object(s.useState)(null),h=Object(i.a)(j,2),f=h[0],v=h[1];Object(s.useEffect)((function(){!function(){var e=document.getElementById("scrolldiv");e&&(e.scrollTop=e.scrollHeight)}()}),[r.contacts]);var x=r.currentReceiver&&0!==r.contacts.filter((function(e){return!(!q(e.user)||e.user.userName!==r.currentReceiver)||!(!X(e.user)||e.user.groupName!==r.currentReceiver)})).length,E=x&&r.contacts.filter((function(e){return!(!q(e.user)||e.user.userName!==r.currentReceiver)||!(!X(e.user)||e.user.groupName!==r.currentReceiver)}))[0].user,M=q(E)&&E.active,K=function(e,t){if(0!==e.length){var a=Date.now(),s={timestamp:Date.now(),id:P.a.createHash("sha256").update(a+"."+r.auth.userName).digest("hex"),type:t,sender:r.auth.userName?r.auth.userName:"",receiver:r.currentReceiver?r.currentReceiver:"",body:e,status:S},c=null,i=r.contacts.filter((function(e){return!(!q(e.user)||e.user.userName!==r.currentReceiver)}));i.length&&q(i[0].user)&&(c=i[0].user.publicKey),B.emit("send_message",JSON.stringify({userName:r.auth.userName,sessionKey:r.auth.sessionKey,message:Object(u.a)(Object(u.a)({},Y(s,c)),{},{status:void 0})})),n({type:W.SEND_NEW_MESSAGE,payload:s}),p("")}};Object(s.useEffect)((function(){return B.connected||B.connect(),B.emit("new_connection",JSON.stringify({userName:r.auth.userName,sessionKey:r.auth.sessionKey})),B.on("recv_message",(function(e){var t=JSON.parse(e);n({type:W.NEW_MESSAGE,payload:t})})),B.on("ack_message",(function(e){var t=JSON.parse(e);n({type:W.SET_ACK_FLAG,payload:t})})),B.on("user_state_change",(function(e){console.log("user_state_change: "+e)})),function(){B.close()}}),[]),Object(s.useEffect)((function(){(function(){var e=Object(b.a)(d.a.mark((function e(){var t,a,s,c,i;return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!r.auth.userName||!r.auth.sessionKey){e.next=25;break}return e.prev=1,e.next=4,w.get("/api/pendingMessages?userName=".concat(r.auth.userName,"&sessionKey=").concat(r.auth.sessionKey));case 4:t=e.sent,a=t.data.messageList,s=localStorage.getItem(r.auth.userName+N),c=s?JSON.parse(s):[],i=Q(c,a,r.auth.privateKey,!1),n({type:W.UPDATE_CONTACTS,payload:i}),e.next=25;break;case 12:if(e.prev=12,e.t0=e.catch(1),!e.t0.response){e.next=24;break}e.t1=e.t0.response.status,e.next=401===e.t1?18:20;break;case 18:return D("Session key may have expired, please login again."),e.abrupt("break",22);case 20:return D("Something went wrong. Try again."),e.abrupt("break",22);case 22:e.next=25;break;case 24:D("Could not contact contact server.");case 25:case"end":return e.stop()}}),e,null,[[1,12]])})));return function(){return e.apply(this,arguments)}})()()}),[n,r.auth.sessionKey,r.auth.userName,r.auth.privateKey]);var T=new FileReader;T.addEventListener("load",(function(){T.result&&v(T.result.toString())})),Object(s.useEffect)((function(){f&&(K(f,y),v(null))}),[f]);var A;return Object(I.jsxs)("div",{className:F.a.MessengerMain,children:[x?Object(I.jsx)("div",{className:F.a.header+" row",children:Object(I.jsx)("div",{className:"col s12",children:Object(I.jsxs)("h5",{children:[(null===(e=r.currentReceiver)||void 0===e?void 0:e.startsWith(g))?r.currentReceiver.replace(g,""):null===(t=r.currentReceiver)||void 0===t?void 0:t.replace(O,""),q(E)?Object(I.jsx)("i",{className:F.a.activeIconMargin+" material-icons tooltipped","data-position":"bottom","data-tooltip":M?"Active Now":"Offline",children:M?"notifications_active":"notifications_paused"}):null]})})}):"",x?Object(I.jsx)("div",{className:F.a.messageList+" row",children:Object(I.jsx)("div",{id:"scrolldiv",className:F.a.scroll+" col s12",children:(A=r.contacts.filter((function(e){return!(!q(e.user)||e.user.userName!==r.currentReceiver)||!(!X(e.user)||e.user.groupName!==r.currentReceiver)}))[0].messages,Object(o.a)(new Map(A.map((function(e){return[e.id,e]}))).values())).map((function(e,t){var a=function(){var t=Object(I.jsx)(I.Fragment,{});switch(e.status){case S:t=Object(I.jsx)("i",{className:"material-icons",children:"access_time"});break;case C:t=Object(I.jsx)("i",{className:"material-icons",children:"error"});break;case k:t=Object(I.jsx)("i",{className:"material-icons",children:"check_circle"})}var a=Object(I.jsx)(I.Fragment,{});return e.type===_&&"string"===typeof e.body?a=Object(I.jsx)(I.Fragment,{children:e.body}):e.type===y&&"string"===typeof e.body&&(a=Object(I.jsx)(I.Fragment,{children:Object(I.jsx)("img",{className:F.a.image+" materialboxed",src:e.body,alt:"<>img data not loaded</>"})})),Object(I.jsxs)(I.Fragment,{children:[Object(I.jsxs)("p",{children:[Object(I.jsx)("i",{className:"material-icons",children:"account_circle"}),Object(I.jsx)("small",{children:e.sender.replace(g,"")})]}),Object(I.jsx)("p",{children:a}),Object(I.jsxs)("p",{children:[Object(I.jsx)("small",{children:new Date(e.timestamp).toISOString()}),Object(I.jsx)("small",{className:"right",children:t})]})]})};return Object(I.jsx)("div",{className:F.a.MessageView,children:Object(I.jsx)("div",{className:"row",children:e.sender!==r.auth.userName?Object(I.jsx)("div",{className:F.a.receiver+" "+(e.type===y?F.a.reimage:"")+" col l5 s8",children:Object(I.jsx)(a,{})}):Object(I.jsx)("div",{className:F.a.sender+" col l5 s8 offset-l7  offset-s4",children:Object(I.jsx)(a,{})})})},t)}))})}):Object(I.jsx)("div",{className:"row",children:Object(I.jsx)("div",{className:F.a.empty+" col s12 valign-wrapper center-align",children:Object(I.jsx)("div",{className:F.a.ncscenter,children:Object(I.jsx)("h6",{children:"No contact selected."})})})}),x?Object(I.jsx)("div",{className:F.a.input+" row",children:Object(I.jsx)("div",{className:"col s12",children:Object(I.jsxs)("div",{className:"row",children:[Object(I.jsxs)("div",{className:"col s8 l10 input-field",children:[Object(I.jsx)("input",{id:"main-text-send",type:"text",className:"validate",value:m,onChange:function(e){p(e.target.value)},onKeyDown:function(e){"Enter"===e.key&&r.currentReceiver&&K(m,_)}}),Object(I.jsx)("label",{htmlFor:"main-text-send",children:"Type a message"})]}),Object(I.jsx)("div",{className:"col l1 s2 center",children:Object(I.jsx)("button",{className:"btn",onClick:function(){r.currentReceiver&&K(m,_)},children:Object(I.jsx)("i",{className:"material-icons",children:"send"})})}),Object(I.jsxs)("div",{className:"col l1 s2 center",children:[Object(I.jsx)("input",{id:"imgupload",type:"file",hidden:!0,onChange:function(e){e.target.files&&e.target.files.length?T.readAsDataURL(e.target.files[0]):v(null)}}),Object(I.jsx)("button",{className:"btn",onClick:function(){var e=document.getElementById("imgupload");e&&e.click()},children:Object(I.jsx)("i",{className:"material-icons",children:"add_a_photo"})})]})]})})}):""]})},q=function(e){return e&&"userName"in e&&"publicKey"in e&&"active"in e},X=function(e){return e&&"groupName"in e&&"members"in e},z={auth:{userName:null,sessionKey:null,privateKey:null,publicKey:null,hash:null},contacts:[],currentReceiver:null},$=Object(s.createContext)({state:z,dispatch:function(){return null}}),ee=function(e,t){switch(t.type){case W.SIGN_UP:return localStorage.setItem(t.payload.userName+f,t.payload.privateKey),localStorage.setItem(t.payload.userName+v,t.payload.publicKey),Object(u.a)(Object(u.a)({},e),{},{auth:Object(u.a)(Object(u.a)({},e.auth),t.payload)});case W.LOAD_RSA_KEYS:case W.SIGN_IN:return Object(u.a)(Object(u.a)({},e),{},{auth:Object(u.a)(Object(u.a)({},e.auth),t.payload)});case W.LOAD_USER_LOCAL_STATE:return Object(u.a)(Object(u.a)({},e),{},{contacts:Object(o.a)(t.payload)});case W.UPDATE_CONTACTS:return localStorage.setItem(e.auth.userName+N,JSON.stringify(t.payload)),Object(u.a)(Object(u.a)({},e),{},{contacts:Object(o.a)(t.payload)});case W.SET_RECEIVER:var a=e.contacts.map((function(e){return q(e.user)&&e.user.userName===t.payload.currentReceiver?Object(u.a)(Object(u.a)({},e),{},{user:Object(u.a)(Object(u.a)({},e.user),{},{publicKey:t.payload.publicKey?t.payload.publicKey:e.user.publicKey,active:t.payload.active}),unread:!1}):X(e.user)&&e.user.groupName===t.payload.currentReceiver?Object(u.a)(Object(u.a)({},e),{},{user:Object(u.a)(Object(u.a)({},e.user),{},{members:Object(o.a)(t.payload.members)}),unread:!1}):e}));return localStorage.setItem(e.auth.userName+N,JSON.stringify(a)),Object(u.a)(Object(u.a)({},e),{},{currentReceiver:t.payload.currentReceiver,contacts:a});case W.NEW_MESSAGE:var s=Q(e.contacts,[t.payload],e.auth.privateKey,!1);return localStorage.setItem(e.auth.userName+N,JSON.stringify(s)),Object(u.a)(Object(u.a)({},e),{},{contacts:Object(o.a)(s)});case W.SEND_NEW_MESSAGE:var r=Q(e.contacts,[t.payload],null,!0);return localStorage.setItem(e.auth.userName+N,JSON.stringify(r)),Object(u.a)(Object(u.a)({},e),{},{contacts:Object(o.a)(r)});case W.SET_ACK_FLAG:var n=e.contacts.map((function(e){return Object(u.a)(Object(u.a)({},e),{},{messages:e.messages.map((function(e){return e.id===t.payload.id?Object(u.a)(Object(u.a)({},e),{},{status:t.payload.body?k:C}):e}))})}));return localStorage.setItem(e.auth.userName+N,JSON.stringify(n)),Object(u.a)(Object(u.a)({},e),{},{contacts:Object(o.a)(n)});case W.LOGOUT:return sessionStorage.removeItem(x),Object(u.a)(Object(u.a)({},e),{},{auth:Object(u.a)(Object(u.a)({},e.auth),{},{sessionKey:t.payload})});default:return e}},te=function(e){var t=Object(s.useReducer)(ee,z),a=Object(i.a)(t,2),r=a[0],n=a[1];return Object(I.jsx)($.Provider,{value:{state:r,dispatch:n},children:e.children})},ae=$,se=a(20),re=a.n(se),ne=function(){var e=Object(s.useContext)(ae),t=e.state,a=e.dispatch,r=Object(s.useState)(""),n=Object(i.a)(r,2),c=n[0],o=n[1],l=Object(s.useState)(""),m=Object(i.a)(l,2),p=m[0],j=m[1];Object(s.useEffect)((function(){var e=localStorage.getItem(g+c+f),t=localStorage.getItem(g+c+v);if(e&&t){var s=P.a.createHash("sha256").update(e).digest("hex");a({type:W.LOAD_RSA_KEYS,payload:{privateKey:e,publicKey:t,hash:s}})}else a({type:W.LOAD_RSA_KEYS,payload:{privateKey:null,publicKey:null,hash:null}})}),[a,c]);var h=function(){var e=Object(b.a)(d.a.mark((function e(s){var r,n;return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(s.preventDefault(),j(""),!(r=t.auth.hash)){e.next=27;break}return e.prev=4,j("Signing you in..."),e.next=8,w.post("/api/validateUser",{userName:g+c,hash:r});case 8:n=e.sent,sessionStorage.setItem(x,JSON.stringify(Object(u.a)(Object(u.a)({},t.auth),{},{sessionKey:n.data.sessionKey,userName:n.data.userName}))),a({type:W.SIGN_IN,payload:{userName:n.data.userName,sessionKey:n.data.sessionKey}}),e.next=25;break;case 13:if(e.prev=13,e.t0=e.catch(4),!e.t0.response){e.next=24;break}e.t1=e.t0.response.status,e.next=401===e.t1?19:21;break;case 19:return j("Authentication failed."),e.abrupt("break",22);case 21:j("Something went wrong. Try again.");case 22:e.next=25;break;case 24:j("Could not contact server. Try again.");case 25:e.next=28;break;case 27:j("RSA credentials not found in local storage.");case 28:case"end":return e.stop()}}),e,null,[[4,13]])})));return function(t){return e.apply(this,arguments)}}(),O=function(){var e=Object(b.a)(d.a.mark((function e(t){var s,r,n,i,o;return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t.preventDefault(),j(""),s=new H.a({b:512}),r=s.exportKey("public"),n=s.exportKey("private"),i=P.a.createHash("sha256").update(n).digest("hex"),e.prev=6,j("Creating new user..."),e.next=10,w.post("/api/createUser",{userName:g+c,hash:i,publicKey:r});case 10:o=e.sent,a({type:W.SIGN_UP,payload:{userName:o.data.userName,privateKey:n,publicKey:r,hash:i}}),j("User created."),e.next=27;break;case 15:if(e.prev=15,e.t0=e.catch(6),!e.t0.response){e.next=26;break}e.t1=e.t0.response.status,e.next=401===e.t1?21:23;break;case 21:return j("User already exists."),e.abrupt("break",24);case 23:j("Something went wrong. Try again.");case 24:e.next=27;break;case 26:j("Could not contact server. Try again.");case 27:case"end":return e.stop()}}),e,null,[[6,15]])})));return function(t){return e.apply(this,arguments)}}();return Object(I.jsx)("div",{className:re.a.Login,children:Object(I.jsxs)("div",{className:re.a.loginContainer+" row",children:[Object(I.jsx)("div",{className:re.a.banner+" col l8 m6 hide-on-small-only valign-wrapper",children:Object(I.jsxs)("div",{className:"col m11 offset-m1",children:[Object(I.jsx)("h1",{children:"Introducing firebird."}),Object(I.jsx)("h5",{children:"A Fast end-to-end Encrypted Messenger"}),Object(I.jsxs)("p",{children:["No more remembering passwords. ",Object(I.jsx)("br",{}),"Password-less authentication using asymmetric key pairs for one tap ",Object(I.jsx)("br",{}),"login and signing up. ",Object(I.jsx)("br",{})]}),Object(I.jsxs)("p",{children:["All user information is persisted client-side. ",Object(I.jsx)("br",{})]})]})}),Object(I.jsx)("div",{className:re.a.loginForm+" col l4 m6 s12 valign-wrapper",children:Object(I.jsxs)("form",{className:re.a.formMain,children:[Object(I.jsxs)("div",{className:re.a.loginHeader+" row",children:[Object(I.jsx)("h1",{children:"firebird"}),Object(I.jsx)("h6",{children:"Secured by RSA end-to-end Encryption"})]}),Object(I.jsx)("div",{className:"row",children:Object(I.jsxs)("div",{className:"input-field col s8 offset-s2",children:[Object(I.jsx)("input",{id:"user",type:"text",className:"validate",onChange:function(e){o(e.target.value),j("")},value:c}),Object(I.jsx)("label",{htmlFor:"user",children:"Username: "}),Object(I.jsx)("span",{className:re.a.error+" helper-text",children:p})]})}),Object(I.jsxs)("div",{className:"row",children:[Object(I.jsx)("div",{className:"col m3 offset-m3 s4 offset-s2 center",children:Object(I.jsx)("button",{className:re.a.submitbtn+" btn",onClick:h,children:"Login"})}),Object(I.jsx)("div",{className:"col m3 s4 center",children:Object(I.jsx)("button",{className:re.a.submitbtn+" btn",onClick:O,children:"Join"})})]})]})})]})})},ce=a(10),ie=a.n(ce),oe=function(e){var t=Object(o.a)(e);return t.sort((function(e,t){if(0===e.messages.length&&0===e.messages.length)return 0;if(0===e.messages.length)return 1;if(0===t.messages.length)return-1;var a=e.messages[e.messages.length-1].timestamp,s=t.messages[t.messages.length-1].timestamp;return a<s?1:a>s?-1:0})),t},ue=function(e){var t,a=Object(s.useContext)(ae),r=a.state,n=a.dispatch,c=Object(s.useState)(""),o=Object(i.a)(c,2),u=o[0],l=o[1],m=Object(s.useState)(r.contacts),p=Object(i.a)(m,2),j=p[0],h=p[1];Object(s.useEffect)((function(){var e=r.contacts.filter((function(e){return!(!q(e.user)||!e.user.userName.startsWith(g+u))||!(!X(e.user)||!e.user.groupName.startsWith(O+u))}));h(e)}),[r.contacts,u]);var f=function(){var e=Object(b.a)(d.a.mark((function e(t){var a,s,c;return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t=g+t,!r.contacts.filter((function(e){return q(e.user)&&e.user.userName===t})).length){e.next=4;break}return e.abrupt("return");case 4:return e.prev=4,e.next=7,w.get("/api/publicKey?userName=".concat(r.auth.userName,"&sessionKey=").concat(r.auth.sessionKey,"&user=").concat(t));case 7:a=e.sent,s={user:{userName:t,publicKey:a.data.publicKey,active:!1},messages:[],unread:!1},(c=r.contacts).push(s),n({type:W.UPDATE_CONTACTS,payload:c}),l(""),e.next=27;break;case 15:if(e.prev=15,e.t0=e.catch(4),!e.t0.response){e.next=26;break}e.t1=e.t0.response.status,e.next=401===e.t1?21:23;break;case 21:return D("Invalid username."),e.abrupt("break",24);case 23:D("Something went wrong. Try again.");case 24:e.next=27;break;case 26:D("Could not contact server. Try again.");case 27:case"end":return e.stop()}}),e,null,[[4,15]])})));return function(t){return e.apply(this,arguments)}}(),v=function(){var e=Object(b.a)(d.a.mark((function e(t){var a,s,c,i,o,u,l,b;return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(a=!1,s=null,c=[],!(i=r.contacts.filter((function(e){return!(!q(e.user)||e.user.userName!==t)||!(!X(e.user)||e.user.groupName!==t)}))).length){e.next=67;break}if(o=i[0],!q(o.user)){e.next=48;break}if(o.user.publicKey){e.next=27;break}return e.prev=8,e.next=11,w.get("/api/publicKey?userName=".concat(r.auth.userName,"&sessionKey=").concat(r.auth.sessionKey,"&user=").concat(t));case 11:u=e.sent,s=u.data.publicKey,e.next=27;break;case 15:if(e.prev=15,e.t0=e.catch(8),!e.t0.response){e.next=26;break}e.t1=e.t0.response,e.next=401===e.t1?21:23;break;case 21:return D("Session key may have expired, please login again."),e.abrupt("break",24);case 23:D("Something went wrong. Try again.");case 24:e.next=27;break;case 26:D("Could not contact contact server.");case 27:return e.prev=27,e.next=30,w.get("/api/userActive?userName=".concat(r.auth.userName,"&sessionKey=").concat(r.auth.sessionKey,"&user=").concat(t));case 30:l=e.sent,a=l.data.active,e.next=46;break;case 34:if(e.prev=34,e.t2=e.catch(27),!e.t2.response){e.next=45;break}e.t3=e.t2.response,e.next=401===e.t3?40:42;break;case 40:return D("Session key may have expired, please login again."),e.abrupt("break",43);case 42:D("Something went wrong. Try again.");case 43:e.next=46;break;case 45:D("Could not contact contact server.");case 46:e.next=67;break;case 48:return e.prev=48,e.next=51,w.get("/api/groupMembers?userName=".concat(r.auth.userName,"&sessionKey=").concat(r.auth.sessionKey,"&groupName=").concat(t));case 51:b=e.sent,c=b.data.groupMembers,e.next=67;break;case 55:if(e.prev=55,e.t4=e.catch(48),!e.t4.response){e.next=66;break}e.t5=e.t4.response,e.next=401===e.t5?61:63;break;case 61:return D("Session key may have expired, please login again."),e.abrupt("break",64);case 63:D("Something went wrong. Try again.");case 64:e.next=67;break;case 66:D("Could not contact contact server.");case 67:n({type:W.SET_RECEIVER,payload:{currentReceiver:t,active:a,publicKey:s,members:c}});case 68:case"end":return e.stop()}}),e,null,[[8,15],[27,34],[48,55]])})));return function(t){return e.apply(this,arguments)}}(),N=function(){var e=Object(b.a)(d.a.mark((function e(t){var a,s,c;return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=O+t,e.prev=1,e.next=4,w.post("/api/createGroup",{userName:r.auth.userName,sessionKey:r.auth.sessionKey,groupName:t});case 4:a=e.sent,s={groupName:a.data.groupName,members:[]},r.auth.userName&&s.members.push(r.auth.userName),(c=r.contacts).push({user:s,messages:[],unread:!1}),n({type:W.UPDATE_CONTACTS,payload:c}),l(""),e.next=25;break;case 13:if(e.prev=13,e.t0=e.catch(1),!e.t0.response){e.next=24;break}e.t1=e.t0.response.status,e.next=401===e.t1?19:21;break;case 19:return D("Group already exists."),e.abrupt("break",22);case 21:D("Something went wrong. Try again.");case 22:e.next=25;break;case 24:D("Could not contact server. Try again.");case 25:case"end":return e.stop()}}),e,null,[[1,13]])})));return function(t){return e.apply(this,arguments)}}(),x=function(){var e=Object(b.a)(d.a.mark((function e(t){var a,s,c,i;return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t=O+t,!r.contacts.filter((function(e){return X(e.user)&&e.user.groupName===t})).length){e.next=4;break}return e.abrupt("return");case 4:return e.prev=4,e.next=7,w.post("/api/joinGroup",{userName:r.auth.userName,sessionKey:r.auth.sessionKey,groupName:t});case 7:return a=e.sent,e.next=10,w.get("/api/groupMembers?userName=".concat(r.auth.userName,"&groupName=").concat(t,"&sessionKey=").concat(r.auth.sessionKey));case 10:s=e.sent,c={groupName:a.data.groupName,members:s.data.groupMembers},(i=r.contacts).push({user:c,messages:[],unread:!1}),n({type:W.UPDATE_CONTACTS,payload:i}),l(""),e.next=30;break;case 18:if(e.prev=18,e.t0=e.catch(4),!e.t0.response){e.next=29;break}e.t1=e.t0.response.status,e.next=401===e.t1?24:26;break;case 24:return D("Group does not exist"),e.abrupt("break",27);case 26:D("Something went wrong. Try again.");case 27:e.next=30;break;case 29:D("Could not contact server. Try again.");case 30:case"end":return e.stop()}}),e,null,[[4,18]])})));return function(t){return e.apply(this,arguments)}}(),_=function(e,t,a){return Object(I.jsx)("li",{className:ie.a.ContactView,children:Object(I.jsx)("div",{children:Object(I.jsxs)("button",{className:(a?ie.a.contactSelected:"")+" btn",onClick:function(){v(q(e.user)?e.user.userName:e.user.groupName)},children:[Object(I.jsx)("i",{className:ie.a.userIcon+" large material-icons left",children:q(e.user)?"account_circle":"group"}),q(e.user)?e.user.userName.replace(g,""):e.user.groupName.replace(O,""),e.unread?Object(I.jsx)("i",{className:ie.a.fiberNewMargin+" material-icons",children:"fiber_new"}):null,Object(I.jsx)("a",{className:"right",href:"#react",onClick:function(){return function(e){var t=r.contacts.filter((function(t){return(!q(t.user)||t.user.userName!==e)&&(!X(t.user)||t.user.groupName!==e)}));n({type:W.UPDATE_CONTACTS,payload:t})}(q(e.user)?e.user.userName:e.user.groupName)},children:Object(I.jsx)("i",{className:"material-icons",children:"close"})})]})})},t)};return Object(I.jsx)("div",{className:ie.a.Contacts+" row",children:Object(I.jsxs)("div",{className:"col s12",children:[Object(I.jsx)("div",{className:ie.a.r1+" row",children:Object(I.jsxs)("div",{className:"col s12 m10 offset-m1 input-field",children:[Object(I.jsx)("i",{className:"material-icons prefix",children:"search"}),Object(I.jsx)("input",{id:e.name,type:"text",className:"validate",onChange:function(e){l(e.target.value)},value:u}),Object(I.jsx)("label",{htmlFor:e.name,children:"Search or add new contacts"})]})}),Object(I.jsx)("div",{className:ie.a.r2+" row",children:Object(I.jsx)("div",{className:"col s12 m10 offset-m1",children:Object(I.jsxs)("div",{className:"row",children:[Object(I.jsx)("div",{className:ie.a.welcome+" col s8 m9",children:Object(I.jsxs)("h6",{children:["Welcome, ",null===(t=r.auth.userName)||void 0===t?void 0:t.replace(g,"")]})}),Object(I.jsx)("div",{className:"col s1 center",children:Object(I.jsx)("button",{type:"button","data-position":"bottom","data-tooltip":"Add contact",className:ie.a.btn+" btn btn-small tooltipped",onClick:function(){f(u)},children:Object(I.jsx)("i",{className:"material-icons",children:"person_add"})})}),Object(I.jsx)("div",{className:"col s1 center",children:Object(I.jsx)("button",{type:"button","data-position":"top","data-tooltip":"Create group",className:ie.a.btn+" btn btn-small tooltipped",onClick:function(){return N(u)},children:Object(I.jsx)("i",{className:"material-icons",children:"group_add"})})}),Object(I.jsx)("div",{className:"col s1 center",children:Object(I.jsx)("button",{type:"button","data-position":"bottom","data-tooltip":"Join group",className:ie.a.btn+" btn btn-small tooltipped",onClick:function(){return x(u)},children:Object(I.jsx)("i",{className:"material-icons",children:"groups"})})})]})})}),Object(I.jsx)("ul",{className:ie.a.list,children:j.length?oe(j).map((function(e,t){return _(e,t,r.currentReceiver===(q(e.user)?e.user.userName:e.user.groupName))})):Object(I.jsx)("div",{className:ie.a.vh60+" valign-wrapper center-align",children:Object(I.jsx)("div",{className:ie.a.ncpfcenter,children:Object(I.jsx)("h6",{children:"No contacts for applied filter"})})})})]})})},le=a(21),de=a.n(le),be=function(){var e=Object(s.useContext)(ae).dispatch,t=function(){document.querySelectorAll(".tooltipped").forEach((function(e){M.Tooltip.getInstance(e).close()})),e({type:W.LOGOUT,payload:null})};return Object(I.jsxs)("div",{className:de.a.Messenger,children:[Object(I.jsx)("div",{className:"hide-on-med-and-up",children:Object(I.jsxs)("div",{id:"slide-out",className:de.a.sidenav+" sidenav",children:[Object(I.jsxs)("div",{className:de.a.header+" row",children:[Object(I.jsx)("div",{className:"col m11 s10",children:Object(I.jsx)("h2",{children:"firebird"})}),Object(I.jsx)("div",{className:de.a.logout+" col  m1 s2",children:Object(I.jsx)("a",{href:"#react",className:"tooltipped","data-position":"bottom","data-tooltip":"Logout",onClick:t,children:Object(I.jsx)("i",{className:"material-icons",children:"exit_to_app"})})})]}),Object(I.jsx)(ue,{name:"sidenav"})]})}),Object(I.jsxs)("div",{className:de.a.messengerContainer+" row",children:[Object(I.jsxs)("div",{className:de.a.cborder+" col l4 m6 hide-on-small-only",children:[Object(I.jsxs)("div",{className:de.a.header+" row",children:[Object(I.jsx)("div",{className:"col m11 s10",children:Object(I.jsx)("h2",{children:"firebird"})}),Object(I.jsx)("div",{className:de.a.logout+" col m1 s2",children:Object(I.jsx)("a",{href:"#react",className:"tooltipped","data-position":"bottom","data-tooltip":"Logout",onClick:t,children:Object(I.jsx)("i",{className:"material-icons",children:"exit_to_app"})})})]}),Object(I.jsx)(ue,{name:"main"})]}),Object(I.jsxs)("div",{className:"col l8 m6 s12",children:[Object(I.jsx)("div",{className:de.a.sidenavIcon+" row hide-on-med-and-up",children:Object(I.jsx)("a",{href:"#react","data-target":"slide-out",className:"sidenav-trigger",children:Object(I.jsx)("i",{className:"material-icons",children:"menu"})})}),Object(I.jsx)(Z,{})]})]})]})},me=a(177),pe=a.n(me),je=function(){var e=Object(s.useContext)(ae),t=e.state,a=e.dispatch;return Object(s.useEffect)((function(){pe.a.AutoInit()})),Object(s.useEffect)((function(){var e=sessionStorage.getItem(x);if(e){var t=JSON.parse(e);a({type:W.SIGN_IN,payload:t})}}),[a]),Object(I.jsxs)(I.Fragment,{children:[t.auth.sessionKey?Object(I.jsx)(be,{}):Object(I.jsx)(ne,{}),Object(I.jsx)(G,{})]})},he=function(e){e&&e instanceof Function&&a.e(3).then(a.bind(null,357)).then((function(t){var a=t.getCLS,s=t.getFID,r=t.getFCP,n=t.getLCP,c=t.getTTFB;a(e),s(e),r(e),n(e),c(e)}))};c.a.render(Object(I.jsx)(r.a.StrictMode,{children:Object(I.jsx)(te,{children:Object(I.jsx)(je,{})})}),document.getElementById("root")),he()}},[[356,1,2]]]);
//# sourceMappingURL=main.c11461e8.chunk.js.map