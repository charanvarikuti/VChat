import { Component, Inject, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GeminiService } from './gemini-service.service';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, } from '@angular/forms';
// import { GeminiService } from './gemini.service';
import { TtsService } from './tts.service'
import { API_URL } from './app.tokens';
import { from } from 'rxjs';
import { Clipboard } from '@angular/cdk/clipboard';
import { SpeechService } from './speechtotext.service';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-root',
  // standalone: true,
  // imports: [RouterOutlet ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'geminidemo';
   form: FormGroup
   txt:any
   isToggled: boolean = true;
   popup:any;
   apiurl:any
   reqtxt:any;
   isBtnDisable:boolean=true;
   isTyping: boolean = false;
   throughspeech:boolean=false;
   urlToShare:any;
   loader:boolean=false
   loader1:boolean=false
   copied:boolean=false;
   inputFld:any;
   initialFlag:boolean=false;
   textToSpeak: string = '';
   speakToogle:boolean=false;
   chatHistory:any=[];
   customchatHistory:any=[];
   customChat:boolean=false;
   index:any=0;
   clickedBtn:boolean=false;
   clickedCustomBtn:boolean=false;
   transcript: string = '';
   isRecording: boolean = false;
   logoFlag:boolean=true;
   Options:boolean=true;
   OptionsIcons:boolean=false;
   isDarkMode:boolean;
   formGroupValues:any;
   homeFlag:boolean=false;
   Message:any;
   formData = [
    { name: 'Maps', label: '', type: 'text', value: 'Maps' ,isReadonly:true},
    { name: 'Gmail', label: '', type: 'text', value: 'Gmail' ,isReadonly:true},
    { name: 'Instagram', label: '', type: 'text', value: 'Instagram' ,isReadonly:true},
    { name: 'Whatsapp', label: '', type: 'text', value: 'Whatsapp',isReadonly:true },
    // { name: 'email', label: 'Email', type: 'email', value: 'Open Instagram' ,isReadonly:true}
  ];
  ResponseData :any=[]
  responseFlag: boolean =false;
  inputChat: boolean;
  // geminiService:GeminiService = inject(GeminiService);
  constructor( 
    public http: HttpClient,
    public geminiService:GeminiService,
    private clipboard: Clipboard,
    private ttsService: TtsService,
    private speechService: SpeechService,
    private fb: FormBuilder
    // @Inject(API_URL) private apiUrlToken: string
  )
  {
    this.form = this.fb.group({
      Chat: ['', [Validators.required]],
     
    });
    this.txt="V-Chat"
    if(this.txt=="V-Chat"){
      this.initialFlag=false
    }
    this.urlToShare='https://yourwebsite.com';
   this.customchatHistory=[
    {Name:'Maps',user:true},
    {Name:'Instagram',user:true}
   ]
  }
  clickOptions(item:any){
    console.log(item);
    if(item.Name=="Maps"){
      // this.openMap();
      this.inputChat=true;
      // this.openCustomChat(item.Name)

      const url = 'https://mail.google.com/';
      // window.open(url, '_blank');
      this.customchatHistory.push(
        // {Name:"mapsopned",user:false},
        {Name:"Source",user:false,input:true},
        {Name:"Destination",user:false,input:true,btn:true}
      )
    }
  }
  onFormChange(form: FormGroup) {
    console.log('Form Changed:', form.value);
  }
  // onSubmit(){
  //   console.log(this.form.value);
  // }
  submitformData(formGroupValues:any){
    // console.log(data)
    this.formGroupValues=formGroupValues;
    if(this.formGroupValues.controls.Source.value && this.formGroupValues.controls.Destination.value){
      this.openMap(this.formGroupValues);
    }
    
  }
  onClick(eve :any){
    console.log(eve)
    if(eve){
      this.homeFlag=true;
      if(eve.value=='Maps'){
        this.responseFlag=true;
        this.ResponseData=[
          {name: 'Btn',btn:true},
          { name: 'Source', label: 'Source', type: 'text', value: '' ,placeholder:"Enter Source",responseText:true},
          { name: 'Destination', label: 'Destination', type: 'text', value: '' , placeholder:"Enter Destination",responseText:true},
        ]
        // this.openCustomChat(eve.value)
        // this.openMap()
        this.responseFlag=true;
      }else if(eve.value=="Gmail"){
        this.openGmail() 
      }else if(eve.value=="Instagram"){
        this.openInstagramProfile() 
      }else if(eve.value=="Whatsapp"){
        this.openWhatsapp()
      }
    }else{
      this.responseFlag=false;
      this.ResponseData=[]
    }
   
  }
  openCustomChat(data : any){
    // this.responseFlag=true;
  }
  ngOnInit(){
    // Check for saved theme preference in localStorage first
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
      this.isDarkMode = savedTheme === 'dark';
    } else {
      // If no saved theme, detect system theme
      const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
      this.isDarkMode = prefersDarkScheme.matches;
    }

    this.applyTheme();

    // Add listener to detect changes in the device's color scheme
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      this.isDarkMode = e.matches;  // Update mode based on user changes in system preferences
      this.applyTheme();
    });

  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    this.applyTheme();
  }
  applyTheme() {
    if (this.isDarkMode) {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
      localStorage.setItem('theme', 'dark');  // Save preference
    } else {
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');  // Save preference
    }
  }
  
  ngOnchanges(){
    let allItems = document.querySelectorAll('.dot');
    let inputField = document.getElementById('inputField'); 

    // Handle touch start event
    inputField.addEventListener('touchstart', function(event) {
        console.log('Touch started on input field');
        inputField.style.backgroundColor = '#e0f7fa'; // Change background color on touch
    });
  }
  sendData(data?:any){
    let inputField = document.getElementById('inputField') as HTMLInputElement; 
    inputField.disabled=true;
    let c;
    this.logoFlag=false;
    this.loader=true;
    this.isTyping=true;
    if(this.throughspeech && data){
      this.inputFld='';
      c=data;
    }else{
      this.inputFld='';
      c=this.form.value.Chat
    }
    // let c= !this.throughspeech? this.form.value.Chat:this.reqtxt;
    if(c==""){
      this.loader=false;
      this.isTyping=false;
      this.txt="Please enter the Info to Continue"
    }else{
      // let text
      this.loader=true;
      this.loader1=true
      this.speakToogle=false;
      // let index=0;
     
      this.chatHistory.push( {user:true,text:c,});
          let submitButton = document.getElementById('sendbtn')  as HTMLInputElement;
      this.checkInput()
      from(this.geminiService.genText(c)).subscribe(u => 
        {
          this.isTyping=false;
          this.loader=false
          this.txt = u
          this.initialFlag=true
          inputField.disabled=false;
          let allItems = document.querySelectorAll('.dot');
          this.index=this.index+1;
          this.chatHistory.push({user:false,text: this.txt ,id:this.index});
          setTimeout(() => {
            this.loader1=false
          }, 1000);
        });
}
  }
  copytoclipboard(text: string){
    this.stopSpeaking();
    this.clipboard.copy(text);  
    this.copied = true; 
    this.clickedBtn=true;
    this.Options=false;
    this.speakToogle=false;
    this.clickBtn();
    setTimeout(() => {
      this.copied=false;
      this.clickedBtn=false;
      this.Options=true;
    }, 1000);
    
  }
  texttoSpeech(text:any,eve?:any){
    console.log(eve);
    this.speakToogle=true;
    this.clickedBtn=true;
    this.copied=false;
    this.ttsService.speak(text.text);
    this.Options=false;
  }
  stopSpeaking(): void {
    this.ttsService.stopSpeaking();
    this.Options=true;
  
  }
  shareContent(messsage:any): void {
    if (navigator.share) {
      navigator.share({
        title: 'Awesome Content',
        text: messsage.text,
        url: this.urlToShare,
      })
      .then(() => console.log('Content shared successfully!'))
      .catch((error) => console.error('Error sharing content:', error));
    } else {
      alert('Web Share API is not supported in your browser.');
    }
  }

  startVoiceRecognition() {
    this.isRecording = true;
    this.speechService.startListening((text: string) => {
      this.transcript = text;
    });
    // this.sendData(this.transcript)
  }

  stopVoiceRecognition() {
    this.isRecording = false;
    this.throughspeech=true;
    this.speechService.stopListening();
    this.inputFld=this.transcript;
    this.sendData(this.inputFld);


  }
  checkInput(eve?:any) {
    // Get the input field
    let inputField = document.getElementById('inputField')  as HTMLInputElement;
    let submitButton = document.getElementById('sendbtn')  as HTMLInputElement;

      if (inputField.value.trim() !== "") {
        submitButton.disabled = false;
      } else {
        submitButton.disabled = true;
      }
    // // Log the current value of the input field
    // console.log(inputField.value);
  }
startChat(){
  let inputField = document.getElementById('inputField')  as HTMLInputElement;
  inputField.focus();
  this.logoFlag=false;

}
clickcustomBtn(){

}
clickBtn(){
  if(!this.customChat){
    let sideBtn = document.getElementById('side-button')  as HTMLButtonElement ;
  
  if(this.speakToogle && this.clickedBtn){
    this.speakToogle=false;
    this.clickedBtn=false;
    this.Options=true;
  }
  else if(this.copied && this.clickedBtn){
    this.clickedBtn=true;
  }else if(this.Options && !this.speakToogle && !this.copied){
   
    this.openSideBar();
  }
  else if(!this.Options){
    this.closeSideBar();
  }
  }
}
clickHome(){
this.responseFlag=false;
this.ResponseData=[];
this.homeFlag=false
}
openSideBar(){
  this.Options=!this.Options;
  this.OptionsIcons=!this.OptionsIcons;
  this.clickedBtn=true;
  
}
closeSideBar(){
    this.clickedBtn=!this.clickedBtn;
    this.OptionsIcons=!this.OptionsIcons
    this.Options=!this.Options;
}
clearChat(){
  this.chatHistory=[]
  this.logoFlag=true;
}
copyChat(){

  this.chatHistory.forEach((obj: { id: any; }) => {
    delete obj.id;
  });
  let arrayString = JSON.stringify(this.chatHistory);

  navigator.clipboard.writeText(arrayString)
  .then(() => {
    // console.log('Array copied to clipboard successfully!');
  })
  .catch(err => {
    console.error('Failed to copy array: ', err);
  });
  this.clipboard.copy(this.chatHistory);  
}
openMap(data?:any) {
  const encodedSource = encodeURIComponent(data.controls.Source.value);
    const encodedDestination = encodeURIComponent(data.controls.Destination.value);
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const url = `https://www.google.com/maps/dir/?api=1&origin=${encodedSource}&destination=${encodedDestination}`;
        window.open(url, '_blank');
        this.responseMessage()
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Unable to retrieve your location.');
        
      }
    );
  } else {
    alert('Geolocation is not supported by this browser.');
  }
}
responseMessage(){
this.Message="maps is Opened"
}
openGmail() {
  const url = 'https://mail.google.com/';
  window.open(url, '_blank');
}
openInstagramProfile() {
  const url = 'https://www.instagram.com/'
  window.open(url, '_blank');
}
openWhatsapp()
{
  const url = 'https://www.whatsapp.com/'
  window.open(url, '_blank');
}
onFocusOut(){
  this.clickedBtn=false;
  this.Options=true;
  this.OptionsIcons=false;
  this.copied=false;
  this.speakToogle=false;
}
onFocusCustomChatOut(){

}
backHome(eve:any){
  console.log(eve)
}
captureScreen() {
  const element = document.getElementById('chatcontainer') as HTMLElement; // Target element for screenshot
  if (element) {
    html2canvas(element).then(canvas => {
      // Convert canvas to image and trigger download
      const VShot = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = VShot;
      link.download = 'VShot.png';
      link.click(); // Automatically trigger download
      this.clickedBtn=false;
    });
  }
}
onToggle(event: boolean) {
  this.isToggled = event; 
  if(!this.isToggled){
    this.customChat=true;
    this.logoFlag=false

  }else{
    this.customChat=false;
    this.logoFlag=true
  }
}
onResponseFormChange(eve :any){

}
}


