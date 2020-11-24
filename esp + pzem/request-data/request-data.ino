#include <PZEM004Tv30.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>

PZEM004Tv30 pzem(14, 12);

const char* ssid = "NunesWiFi_2G";
const char* password = "Jugger1971@";

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
 
  while (WiFi.status() != WL_CONNECTED) { 
    delay(1000);
    Serial.println("Conectando..");
  }
}

void loop() {
    
    if( !isnan(pzem.voltage()) && !isnan(pzem.current()) && !isnan(pzem.energy()) && !isnan(pzem.frequency())){
      float voltage = pzem.voltage();
      float current = pzem.current();
      float power = pzem.power();
      float frequency = pzem.frequency();

      String url = "http://192.168.0.63/insert-data?tensao="+String(voltage)+"&corrente="+String(current)+"&potencia="+String(power)+"&frequencia="+String(frequency)+"";    
      Serial.println(url);

      if (WiFi.status() == WL_CONNECTED) { 
 
        HTTPClient http;  
         
        http.begin(url); 
        int httpCode = http.GET();                                                                  //Send the request
 
        if (httpCode > 0) { 
         
          String payload = http.getString();   
          Serial.println(payload);                    
         
        } 
        http.end();   
      }
      else{
        Serial.println("Sem conexão.");
      }
    } 
    else{
      Serial.println("Sem dados para leitura.");
    }
    delay(1000);
}
