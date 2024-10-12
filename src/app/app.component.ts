import { Component, Inject, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GeminiService } from './gemini-service.service';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, FormControl, } from '@angular/forms';
// import { GeminiService } from './gemini.service';
import { TtsService } from './tts.service'
import { API_URL } from './app.tokens';
import { from } from 'rxjs';
import { Clipboard } from '@angular/cdk/clipboard';
import { SpeechService } from './speechtotext.service';

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
 
   index:any=0;
   clickedBtn:boolean=false;
   transcript: string = '';
   isRecording: boolean = false;
   logoFlag:boolean=true;
   Options:boolean=true;
   OptionsIcons:boolean=false;
   isDarkMode:boolean;
  // geminiService:GeminiService = inject(GeminiService);
  constructor( 
    public http: HttpClient,
    public geminiService:GeminiService,
    public fb: FormBuilder,
    private clipboard: Clipboard,
    private ttsService: TtsService,
    private speechService: SpeechService
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
    this.urlToShare='https://yourwebsite.com'
    
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
clickBtn(){
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
openMap() {
  const latitude = 37.7749;  // Replace with your desired latitude
  const longitude = -122.4194; // Replace with your desired longitude
  const zoom = 12; // Desired zoom level
  const url = `https://www.google.com/maps/@?api=1&map_action=map&center=${latitude},${longitude}&zoom=${zoom}`;
  
  window.open(url, '_blank'); // Open in a new tab
}
onFocusOut(){
  this.clickedBtn=false;
  this.Options=true;
  this.OptionsIcons=false;
  this.copied=false;
  this.speakToogle=false;
}
}


