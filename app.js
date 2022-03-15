require("dotenv").config(); // Enable dotenv to access environment variables in the .env file.
const fs = require("fs");
const sdk = require("microsoft-cognitiveservices-speech-sdk");

const speechConfig = sdk.SpeechConfig.fromSubscription(
  process.env.SUBSCRIPTION_KEY, // Subscription Key
  process.env.SERVICE_REGION // Service Region
);

speechConfig.speechRecognitionLanguage = "en-ZA"; // Set the speech recognition language.

/**
 * Transcribes speech audio to text from the file specified within the function.
 */
function transcribeFromFile() {
  let audioConfig = sdk.AudioConfig.fromWavFileInput(fs.readFileSync("Obnoxous.wav"));
  let speechRecognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

  speechRecognizer.recognizeOnceAsync((result) => {
    switch (result.reason) {
      case sdk.ResultReason.RecognizedSpeech:
        console.log(`RECOGNIZED: Text=${result.text}`);
        break;
      case sdk.ResultReason.NoMatch:
        console.log("NOMATCH: Speech could not be recognized.");
        break;
      case sdk.ResultReason.Canceled:
        const cancellation = CancellationDetails.fromResult(result);
        console.log(`CANCELED: Reason=${cancellation.reason}`);

        if (cancellation.reason == sdk.CancellationReason.Error) {
          console.log(`CANCELED: ErrorCode=${cancellation.ErrorCode}`);
          console.log(`CANCELED: ErrorDetails=${cancellation.errorDetails}`);
          console.log("CANCELED: Did you update the key and location/region info?");
        }
        break;
    }
    speechRecognizer.close();
  });
}

transcribeFromFile();
