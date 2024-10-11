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
   transcript: string = '';
   isRecording: boolean = false;
   logoFlag:boolean=true;
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
    // this.apiurl=apiUrlToken
  }
  ngOnInit(){
    // this.buildForm()
    let allItems = document.querySelectorAll('.dot');

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
      this.chatHistory.push( {user:true,text:c});
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
          this.chatHistory.push({user:false,text: this.txt });
          setTimeout(() => {
            this.loader1=false
          }, 1000);
        });
        // this.popup = document.getElementById("popup");
        // this.popup.classList.add("show");

  // Hide the popup after 2 seconds
  // setTimeout(function() {
  //   this.popup.classList.remove("show");
  // }, 2000);
}
  }
  copytoclipboard(text: string){
    this.clipboard.copy(text);  
    this.copied = true; 

    setTimeout(() => {
      this.copied = false;
    }, 1000);
  }
  texttoSpeech(text:any){
    this.speakToogle=true;
    this.ttsService.speak(text.text);
  }
  stopSpeaking(): void {
    this.speakToogle=false;
    this.ttsService.stopSpeaking();
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
  sideBtn.classList.toggle('active');
  sideBtn.textContent="okay"
  // this.openMap();
}
openMap() {
  const latitude = 37.7749;  // Replace with your desired latitude
  const longitude = -122.4194; // Replace with your desired longitude
  const zoom = 12; // Desired zoom level
  const url = `https://www.google.com/maps/@?api=1&map_action=map&center=${latitude},${longitude}&zoom=${zoom}`;
  
  window.open(url, '_blank'); // Open in a new tab
}
}


