class sendData{  

  constructor(){
      
      /** Atributes Change */
      this.testType           = null;  // ✔️
      this.viewer             = 0;     
      this.interaction3D      = 0;
      this.interactionAR      = 0;
      this.addToCar           = null;  // ✔️
      this.timeInSesion       = null;  // ✔️

      /** Get only time */
      this.idCompany          = 383;
      this.sku                = null;  // ✔️
      this.category           = null;  // ✔️
      this.subCategory        = null;  // ✔️
      this.pathURL            = null;  // ✔️
      this.date               = null;  // ✔️
      this.infodevice         = null;  // ✔️
      
  };

  /** Consult last type test ✔️ */
  async consultTest(){

      /** verify userMark */
      if(localStorage.getItem('UserMudiTest')) {
          this.testType = localStorage.getItem('UserMudiTest');
          return
      };

      /** when the new user in, mark him */
      let body = {"idCompany": this.idCompany};

      const 
      consult  =  await fetch('https://viewer.mudi.com.co:3589/api/mudiv1/getInfoTest',{
          method:'Post',
          headers:{"Content-type":"application/json"},
          body: JSON.stringify(body)
      })

      /** Update lastTest */
      const 
      response = await consult.json();
      await this.updateTest(response.data[0].test)
  };

  /** Update testActual  ✔️ --> Se puede revisar máaaaaaas a profundidad */
  async updateTest(lastTest){

      /** Modify testType DataBase */
      let testUpdate;
      lastTest == 'A' ? testUpdate = 'B' : testUpdate = 'A';

      /** Body */
      let body = {"idCompany":"383" , "typeTest":`${testUpdate}`};

      /** Request */
      const 
      consult  =  await fetch('https://viewer.mudi.com.co:3589/api/mudiv1/updateInfoTest',{
          method:'Post',
          headers:{"Content-type":"application/json"},
          body: JSON.stringify(body)
      });

      // markUser here in localStorage
      this.testType=testUpdate;
      localStorage.setItem('UserMudiTest',testUpdate)
  };

  /** Recognize 
          HELP TO RECOGNIZE TYPE OF DEVICE  & INFO DEVICE 
          Android device: manufacturer & Model
          IOS : "Apple" & IOS version ✔️
  */
  recognizeDevice(){

      /** Define Structure Response */
      let response = {
          Device: null ,
          type: `Mobile`
      };
      
      const 
      userAgent   = navigator.userAgent,
      listUA      = userAgent.split(" ");

      /** Better use REGEX ❌ Add TO DO */

      /** OS Android  */
          if(userAgent.toLowerCase().includes('android')){
              let androidVersion  = listUA[2] + ' ' + listUA[3];
              let androidModel    = listUA[4] + ' ' + listUA[5];
              response.Device = `Android ${androidModel} V-${androidVersion}`;
          }

      /** IOS */
          else if (userAgent.toLowerCase().includes('iphone'))    
              response.Device = `iPhone OS ${listUA[5].split('_').join('.')}`;
          else if (userAgent.toLowerCase().includes('ipad'))      
              response.Device = `iPad OS ${listUA[5].split('_').join('.')}`;
          else if (userAgent.toLowerCase().includes('Macintosh')) 
              response.Device = `Macintosh OS ${listUA[6].split('_').join('.')}`;
          
      /** Window */
          else if (listUA[1].toLowerCase().includes('windows')){   
              response.Device = `Windows V- ${listUA[3].replace(";", " ")} ${listUA[4].replace(";", " ")}`;
              response.type = `Desk`
          }

      /** Linux */
          else if (userAgent.toLowerCase().includes('linux') && !userAgent.toLowerCase().includes('android')){
              response.Device = `Linux`; 
              response.type   = `Desk`;
          }

      /** Unknowled */
          else {
              response.Device = "Desconocido"
              response.type   = null;
          };

      this.infodevice = response;
  };

  /** Get Date ✔️ FORMAT DATETIME AAAA-MM-DD HH:MM:SS  */
  getDate(){

      /** Build Date */
      const dateActual = new Date();

      /** Build information */
      let dateInfo = {
          month           : dateActual.getMonth() + 1,
          day             : dateActual.getDate(),
          year            : dateActual.getFullYear(),
          hour            : dateActual.getHours(),
          minute          : dateActual.getMinutes(),
          seconds         : dateActual.getSeconds()  
      };

      /** Build Date Sesion  dd -- mm -- aa -- ||  hh -- mm -- ss */
      this.date = `${dateInfo.year}-${dateInfo.month<10 ? '0'+ dateInfo.month : dateInfo.month}-${dateInfo.day} ${dateInfo.hour<10 ? '0'+dateInfo.hour : dateInfo.hour}:${dateInfo.minute}:${dateInfo.seconds}`;
  };

  /** GET PATH URL ✔️ */
  getPathURL(){this.pathURL = window.location.pathname};

  /** Event viewer */
  eventView(){
      this.viewer == 0 && (this.viewer++)
  };

  /** Event Mudi interaction 3D AR  */
  eventsMudi3D(){this.interaction3D ++};
  eventsMudiAR(){this.interactionAR ++};

  /** Event add to car */
  eventAddToCar(){
      /** Verifying btn Add to Car */
      let btnAddToCar =  document.body.querySelector('.vtex-add-to-cart-button-0-x-buttonText')
      if(!btnAddToCar){ requestAnimationFrame(this.eventAddToCar.bind(this)) }
      else{ btnAddToCar.parentNode.parentNode.parentNode.addEventListener('click',()=> this.addToCar++ ) }
  };

  /** Timing in Sesion  ✔️*/
  timeSesion(){

      /** Configaration Time */
      let time = {
          hour: 0,
          minutes: 0,
          seconds: 0
      };
  
      setInterval(() => {
  
          /**up one Sec */
          time.seconds++;
  
          /** verify Secs */
          if (time.seconds < 10) {
              time.seconds = `0${time.seconds}`
              time.minutes == 0 && (time.minutes = '00')
              time.hour == 0 && (time.hour = '00')
          }
  
          /** VerifyMinutes */
          if (time.seconds == 60) {
              time.seconds = '00';
              time.minutes++;
              time.minutes < 10 ? time.minutes = `0${time.minutes}` : time.minutes = `${time.minutes}`;
          }
  
          /** Verify hours */
          if (time.minutes == 60) {
              time.minutes = '00';
              time.hour++;
              time.hour < 10 ? time.hour = `0${time.hour}` : time.hour = `${time.hour}`;
          }
  
          this.timeInSesion = `${time.hour}:${time.minutes}:${time.seconds}`;
  
      }, 1000);
  };

  /** Get sku  */
  getSkuNumer(sku){this.sku = sku};

  /** Get Category -- Programar por clientee */
  getCategory(){
      let category = document.body.querySelector('[data-testid="breadcrumb"]') ?? null;

      if (!category) requestAnimationFrame(this.getCategory.bind(this))
      else           this.category       = document.body.querySelector('[data-testid="breadcrumb"]').children[2].innerText;
  };

  /** Get subCategory -- programar por cliente */
  getSubCategory(){
      let subCategory =  document.body.querySelector('[data-testid="breadcrumb"]') ?? null;

      if (!subCategory)   requestAnimationFrame(this.getCategory.bind(this))
      else                this.subCategory       =  document.body.querySelector('[data-testid="breadcrumb"]').children[3].innerText;
  };

  /** Pixel Mudi ON */
  async pixelOn(skunumber){

      let beforeUnloaded =  window.addEventListener('beforeunload', (e)=>{this.sendDataMudiServer()} , false);
      
      /** verify Result typeTest */
      this.testType && (

          /** ✔️ get PathName */
          this.getPathURL(),

          this.getSkuNumer(skunumber),
          this.getCategory(),
          this.getSubCategory(),

          /** Event add To car */
          this.eventAddToCar(),

          /** ✔️ getDate */
          this.getDate(),

          /** ✔️get Device */
          this.recognizeDevice(),

          /** ✔️Listener sendData Mudi */
          beforeUnloaded

      );
  };

  /** sendData MudiSever */
  async sendDataMudiServer(){
      
      /** Build Body */
      let body = {
          "testType"          : this.testType,
          "viewer"            : this.viewer,
          "interaction3D"     : this.interaction3D,
          "interactionAR"     : this.interactionAR,
          "addToCar"          : this.addToCar,
          "idCompany"         : this.idCompany,
          "timeInSesion"      : this.timeInSesion,
          "sku"               : this.sku,
          "category"          : this.category,
          "subCategory"       : this.subCategory,
          "pathURL"           : this.pathURL,
          "dates"             : this.date,
          "device"            : this.infodevice.type,
          "deviceDescription" : this.infodevice.Device
      };

      /** Doing request */
      try {
          const request = await fetch('https://viewer.mudi.com.co:3589/api/mudiv1/sendRegistry',{
              method:'POST',
              headers:{"Content-type":"application/json"},
              body:JSON.stringify(body)
          })
          const response = await request.json();
      } catch (error) {
          console.log(`Mudi Error:` + error)
      };
  };

};
const mudiData = new sendData();
/** ✔️ start timer Mudi */
mudiData.timeSesion();


/*Petición SeverMudi última versión*/
async function serverData ({
  token = undefined,
  sku = undefined
}) {

  // Errores
  if (token == null) { console.error('Error Mudi: Token Api Null') ;  return }
  if ( sku == null)  { console.error('Error Mudi: SKU Null') ;  return}

  // Respuesta positiva 
  let contentBody = { "skus": [`${sku}`] }

  const req = await fetch ('https://mudiview.mudi.com.co:7443/product/getProductsUrl' , {
    method:'POST',
    headers:{
      'Content-Type': 'application/json',
      'tokenapi':token
    },
    body: JSON.stringify(contentBody)
  })

  const jsonResponse = await req.json();
  const finalResponse = jsonResponse.data[0];

  return finalResponse;

};

/** Creamos Los estilos remotos */
function createStyles({idCompany}){
  const link = document.createElement('LINK');
  link.setAttribute('rel','stylesheet');
  link.id="stylesMudiGeneral";
  link.href=`https://mudi.com.co/module/mudi/index-${idCompany}.css`; /* Pueden tomarlos de esta ruta */
 
  document.head.appendChild(link)
};

/** Cuando se obtiene una respuesta positiva del server se crean dos botones ( btn3D y btnAR ) */
function createBtns({father,sku,idCompany,link3D,color,zBtns,zModal,ButtonsY}){

  if(window.innerWidth > 1100){
    father = document.querySelector('div.w-100.border-box.vtex-store-components-3-x-carouselGaleryCursor.ml-20-ns.w-80-ns.pl5-ns')
  }else if( window.innerWidth >500 && window.innerWidth < 1100){
    father = document.querySelector('.vtex-store-components-3-x-carouselGaleryCursor');
  }else if( window.innerWidth <500){
    father = document.querySelector('.vtex-store-components-3-x-carouselGaleryCursor');
  };

  const fatherContainer = father;

  // Creación del contenedor principal para los botones
  const containerPrincipalBtns = document.createElement('DIV');
  containerPrincipalBtns.classList.add('ContainerBtnsMudi');
  containerPrincipalBtns.id="containerBtnsMudi";
  containerPrincipalBtns.setAttribute('style',`z-index:${zBtns}; ${ButtonsY}:0`)
  
  containerPrincipalBtns.innerHTML=`
  <div class="tooltip showTooltipInit">
    <p><b>¡Nuevo!</b> prueba nuestras experiencias de 3D y Realidad Aumentada</p>
  </div>
  <img src="https://mudi.com.co/cliente/${idCompany}/btn3D.webp" alt="Boton Mudi para activar 3D" class="btnMudi3D" id="btnMudi3D" sku=${sku} title="Haz click para tener una experiencia 3D">
  <img src="https://mudi.com.co/cliente/${idCompany}/btnAR.webp" alt="Boton Mudi para activar AR" class="btnMudiAR" id="btnMudiAR" sku=${sku} title="Haz click para tener una experiencia de realidad aumentada">`;
  
  containerPrincipalBtns.querySelector('.btnMudi3D').addEventListener('click',()=>{ 
    createModal3D({link3D:link3D,color:color,zModal:zModal});
    /** PIXEL MUDI */
    mudiData.eventsMudi3D(); 
  },false);

  containerPrincipalBtns.querySelector('.btnMudiAR').addEventListener('click',()=>{ 
    createModalAR({color:color, idCompany:idCompany, sku:sku,zModal:zModal});
    /** PIXEL MUDI */
    mudiData.eventsMudiAR();
  },false);

  if(window.innerWidth > 1100){

    document.getElementById('containerBtnsMudi') ? (
      document.getElementById('containerBtnsMudi').remove(),
      fatherContainer.appendChild(containerPrincipalBtns)
    ) : fatherContainer.appendChild(containerPrincipalBtns);

  }else if( window.innerWidth >500 && window.innerWidth < 1100){

    const elementoHermano = document.querySelector('.vtex-store-components-3-x-carouselGaleryThumbs');
    document.getElementById('containerBtnsMudi') ? (
      document.getElementById('containerBtnsMudi').remove(),
      fatherContainer.insertBefore(containerPrincipalBtns , elementoHermano)
    ): fatherContainer.insertBefore(containerPrincipalBtns , elementoHermano)
    
  }else if( window.innerWidth <500){

    const elementoHermano = document.querySelector('.vtex-store-components-3-x-carouselGaleryThumbs');
    document.getElementById('containerBtnsMudi') ? (
      document.getElementById('containerBtnsMudi').remove(),
      fatherContainer.insertBefore(containerPrincipalBtns , elementoHermano)
    ): fatherContainer.insertBefore(containerPrincipalBtns , elementoHermano)

  };    

  setTimeout(()=>{
    const tool = document.querySelector('.showTooltipInit');
    tool.classList.remove('showTooltipInit')
    tool.classList.add('hideTooltip')
  },10000)

};

/** Creamos el modal 3D */
function createModal3D({link3D,color,zModal}){

  const div = document.createElement('DIV')
  div.classList.add('modalMudi')
  div.id="modalMudi";
  div.setAttribute('style',`z-index:${zModal}`);
  div.innerHTML=`
  <div class="contentModal3D">
    <h1 class="closeModal" style="color:${color}; text-align:center">X</h1>
    <iframe class="iframeMudi3D" src="${link3D}"></iframe>
    <a href="https://mudi.com.co" target="_blank">
      <img class="powerByMudi3D" src="https://mudi.com.co/Assets/SVG/powerByMudi.webp" type="image/webp" alt="Power By Mudi">
    </a>
  </div>`;

  div.querySelector('.closeModal').addEventListener('click',()=>{
    document.body.querySelector('.modalMudi').remove();
  })

  document.body.appendChild(div);
};

/** Creamos el Modal AR */
function createModalAR({color,idCompany,sku,zModal}){
  const div = document.createElement('DIV')
  div.classList.add('modalMudi')
  div.id="modalMudi";
  div.setAttribute('style',`z-index:${zModal}`);
  div.innerHTML=`
    <div class="contentModalAR">
        <h1 class="closeModal" style="color:${color}; text-align:center;">X</h1>
        <h2 class="modalTitleMudi">Recomendaciones para ver el producto en Realidad Aumentada.</h2>

        <div class="principalContentModalAR">

            <div class="fristContentMudi">

                <div class="containerMudiSteps">
                    <img class="imgStepMudi" src="https://mudi.com.co/cliente/${idCompany}/step1.webp">
                    <div class="containerStepsText">
                        <h3 class="stepTitleMudi">Apunta tu teléfono al piso para ver el producto.</h3>
                        <p class="stepParagrahpMudi">Prueba otro espacio si no puedes ver el producto.</p>
                    </div>
                </div>

                <div class="containerMudiSteps">
                    <img class="imgStepMudi" src="https://mudi.com.co/cliente/${idCompany}/step2.webp">
                    <div class="containerStepsText">
                        <h3 class="stepTitleMudi">Desplaza para visualizar.</h3>
                        <p class="stepParagrahpMudi">Mueve tu dedo en la pantalla para rotar la imagen.</p>
                    </div>
                </div>

                <div class="containerMudiSteps">
                    <img class="imgStepMudi" src="https://mudi.com.co/cliente/${idCompany}/step3.webp">
                    <div class="containerStepsText">
                        <h3 class="stepTitleMudi">Amplia y detalla el producto.</h3>
                        <p class="stepParagrahpMudi">Controla el zoom arrastrando dos dedos en la pantalla de adentro hacia afuera.</p>
                    </div>
                </div>

                <div class="containerMudiSteps">
                    <img class="imgStepMudi" src="https://mudi.com.co/cliente/${idCompany}/step4.webp">
                    <div class="containerStepsText">
                        <h3 class="stepTitleMudi">Toca dos veces para restablecer.</h3>
                        <p class="stepParagrahpMudi">Vuelve al tamaño original haciendo doble click sobre el producto.</p>
                    </div>
                </div>

                <button class="initARMudi" style="background-color:${color};">Iniciar AR</button>

            </div>

            <div class="secondContentMudi">
                <h3 class="stepTitleMudi qrTitlePart"> Escanea el código QR para ver el producto en realidad aumentada.</h3>
                <div class="containerQRMudi">
                  <img src="https://chart.apis.google.com/chart?cht=qr&chs=300x300&chl=https%3A%2F%2Fviewer.mudi.com.co%2Fv1%2Far%2F%3Fid%3D${idCompany}%26sku%3D${sku}" class="codeQRMudi">
                </div>
                <a class="hrefMudiAR" href="https://mudi.com.co" target="_blank">
                  <img class="powerByMudiAR" src="https://mudi.com.co/Assets/SVG/powerByMudi.webp" type="image/webp" alt="Power By Mudi">
                </a>
            </div>

        </div>

    </div>`;

    div.querySelector('.closeModal').addEventListener('click',()=>{
      document.body.querySelector('.modalMudi').remove();
    });

    div.querySelector('.initARMudi').addEventListener('click',()=>{
      window.open(`https://viewer.mudi.com.co/v1/ar/?id=${idCompany}&sku=${sku}`)
    })

    document.body.appendChild(div);
};

/**Envío de data DataLayer */
function sendDataLayer({sku}){

  let OSdevice;

  if(navigator.userAgent.includes('Android')) OSdevice='Android';
  else if ( navigator.userAgent.includes('iPhone') || navigator.userAgent.includes('iPad')) OSdevice="IOS";
  else OSdevice='DESK';

  /** Evento de visualización */
  dataLayer.push({
      event:'Evento de visualización Mudi',
      valorMudi:1,
      sku:sku,
      categoria:document.querySelectorAll('.ambientegourmet-breadcrumb-2-x-link')[2] ? document.querySelectorAll('.ambientegourmet-breadcrumb-2-x-link')[2].innerHTML : 'null',
      subCategoria:document.querySelectorAll('.ambientegourmet-breadcrumb-2-x-link')[3] ? document.querySelectorAll('.ambientegourmet-breadcrumb-2-x-link')[3].innerHTML : 'null',
      seccion:document.querySelectorAll('.ambientegourmet-breadcrumb-2-x-link')[4] ? document.querySelectorAll('.ambientegourmet-breadcrumb-2-x-link')[4].innerHTML : 'null',
      sistemaOperativo:OSdevice
  });

  /** Evento de intención de compra */
  document.querySelector('body > div.render-container.render-route-store-product > div > div.vtex-store__template.bg-base > div > div > div > div:nth-child(3) > div > div > section > div.ambientegourmet-components-2-x-containerLayout > div.ambientegourmet-components-2-x-containerLayout.ambientegourmet-components-2-x-containerLayout--pdp-info__container > div.ambientegourmet-components-2-x-containerLayout.ambientegourmet-components-2-x-containerLayout--product-info--container > div.ambientegourmet-components-2-x-stockContainerRender > div > div.ambientegourmet-components-2-x-containerLayout.ambientegourmet-components-2-x-containerLayout--pdp-selector-add-container > button').addEventListener('click',()=>{
      dataLayer.push({
          event:'Agregar al carrito Mudi',
          valorMudi:1,
          sku:sku,
          categoria:document.querySelectorAll('.ambientegourmet-breadcrumb-2-x-link')[2] ? document.querySelectorAll('.ambientegourmet-breadcrumb-2-x-link')[2].innerHTML : 'null',
          subCategoria:document.querySelectorAll('.ambientegourmet-breadcrumb-2-x-link')[3] ? document.querySelectorAll('.ambientegourmet-breadcrumb-2-x-link')[3].innerHTML : 'null',
          seccion:document.querySelectorAll('.ambientegourmet-breadcrumb-2-x-link')[4] ? document.querySelectorAll('.ambientegourmet-breadcrumb-2-x-link')[4].innerHTML : 'null',
          sistemaOperativo:OSdevice
      })
  },false);

  document.querySelector('div.ambientegourmet-components-2-x-containerLayout.ambientegourmet-components-2-x-containerLayout--pdp-buy-now-container > button > div').addEventListener('click',()=>{
    dataLayer.push({
      event:'Comprar ahora Mudi',
      valorMudi:1,
      sku:sku,
      categoria:document.querySelectorAll('.ambientegourmet-breadcrumb-2-x-link')[2] ? document.querySelectorAll('.ambientegourmet-breadcrumb-2-x-link')[2].innerHTML : 'null',
      subCategoria:document.querySelectorAll('.ambientegourmet-breadcrumb-2-x-link')[3] ? document.querySelectorAll('.ambientegourmet-breadcrumb-2-x-link')[3].innerHTML : 'null',
      seccion:document.querySelectorAll('.ambientegourmet-breadcrumb-2-x-link')[4] ? document.querySelectorAll('.ambientegourmet-breadcrumb-2-x-link')[4].innerHTML : 'null',
      sistemaOperativo:OSdevice
    })
  })

  /** Evento de interación AR Mudi */
  document.getElementById('btnMudiAR').addEventListener('click',()=>{
      dataLayer.push({
          event:'Evento de interacción AR Mudi',
          valorMudi:1,
          sku:sku,
          categoria:document.querySelectorAll('.ambientegourmet-breadcrumb-2-x-link')[2] ? document.querySelectorAll('.ambientegourmet-breadcrumb-2-x-link')[2].innerHTML : 'null',
          subCategoria:document.querySelectorAll('.ambientegourmet-breadcrumb-2-x-link')[3] ? document.querySelectorAll('.ambientegourmet-breadcrumb-2-x-link')[3].innerHTML : 'null',
          seccion:document.querySelectorAll('.ambientegourmet-breadcrumb-2-x-link')[4] ? document.querySelectorAll('.ambientegourmet-breadcrumb-2-x-link')[4].innerHTML : 'null',
          sistemaOperativo:OSdevice
      })
  },false);

  /** Evento de interación 3D Mudi */
  document.getElementById('btnMudi3D').addEventListener('click',()=>{
      dataLayer.push({
          event:'Evento de interacción 3D Mudi',
          valorMudi:1,
          sku:sku,
          categoria:document.querySelectorAll('.ambientegourmet-breadcrumb-2-x-link')[2] ? document.querySelectorAll('.ambientegourmet-breadcrumb-2-x-link')[2].innerHTML : 'null',
          subCategoria:document.querySelectorAll('.ambientegourmet-breadcrumb-2-x-link')[3] ? document.querySelectorAll('.ambientegourmet-breadcrumb-2-x-link')[3].innerHTML : 'null',
          seccion:document.querySelectorAll('.ambientegourmet-breadcrumb-2-x-link')[4] ? document.querySelectorAll('.ambientegourmet-breadcrumb-2-x-link')[4].innerHTML : 'null',
          sistemaOperativo:OSdevice
      })
  },false);

};

// Función Main Mudi --
async function MudiExperience ({
  tokenApi,
  skuNumber,
  containerBtns,
  idCompanyMudi,
  color,

  zIndexBtns=1,
  zIndexModal=1,

  positionBtnsY='bottom',
}) {

  const server = await serverData( {token:tokenApi, sku:skuNumber} );
  if(server==undefined){ console.warn(`El producto identificado con el SKU: "%c${skuNumber}%c" en Mudi 3D&AR Commerce, no tiene 3D ni AR`, 'color: red; font-weight: bold', 'color: black;'); return };
  
  await mudiData.consultTest();

  /** Render buttons */
  if (mudiData.typeTest=='A'){
    /** Una vez tengamos la respuesta positiva creamos los estilos generales y los botones */
    createStyles({idCompany:idCompanyMudi});
    createBtns({ father:containerBtns, sku:skuNumber, idCompany:idCompanyMudi, link3D:server.URL_WEB ,color:color, zBtns:zIndexBtns,zModal:zIndexModal, ButtonsY:positionBtnsY});
    sendDataLayer({sku:skuNumber});

    /** prendemos el pixel de Mudi */
    mudiData.pixelOn(skuNumber);
    mudiData.eventView();
  }

  /** Hidden buttons */
  if(mudiData.typeTest=='B'){
    /** prendemos el pixel de Mudi */
    mudiData.pixelOn(skuNumber)
  }
  
};

 MudiExperience({
    tokenApi:'HGrkU6SqAtvcBtLdoD7t',
    skuNumber:document.querySelector('.vtex-product-identifier-0-x-product-identifier__value').innerHTML,
    containerBtns:document.querySelector('.vtex-store-components-3-x-productImage .relative'),
    idCompanyMudi:383,
    color:'#2889e9',
    zIndexModal:1000,
})
