let boxInfo = document.querySelector(".boxInfo")
let alertElement = document.querySelector("#alert")
let initBox = document.querySelector("#initBox")
var timerFetch, timerFetchAll, timerValue = 1000
var alertCount = 0, alertCountLimit = 1, alertStatus = false
var isFirstLoop = true
var optionsChart = { width: "100%", height: "100%" }

var info={
    tensao : {
        element : document.querySelector("#tensao"),
        elementTxt : document.querySelector("#txtTensao"),
        defaultValue : 127,
        rangeMax : 20, 
        rangeMin : 10
    },
    corrente : {
        element : document.querySelector("#corrente"),
        elementTxt : document.querySelector("#txtCorrente"),
        defaultValue : 320,
        rangeMax : 10, 
        rangeMin : 5
    },
    potencia : {
        element : document.querySelector("#potencia"),
        elementTxt : document.querySelector("#txtPotencia"),
        defaultValue : 35,
        rangeMax : 10, 
        rangeMin : 5
    },
    frequencia : {
        element : document.querySelector("#frequencia"),
        elementTxt : document.querySelector("#txtFrequencia"),
        defaultValue : 60,
        rangeMax : 20, 
        rangeMin : 10
    }
}

var chart={
    tensao : {
        arrTensao : [],
        chartTensao : new Chartist.Line('#chart-tensao', { series: [] }, optionsChart)
    },
    corrente : {
        arrCorrente : [],
        chartCorrente : new Chartist.Line('#chart-corrente', { series: [] }, optionsChart)
    },
    potencia : {
        arrPotencia : [],
        chartPotencia : new Chartist.Line('#chart-potencia', { series: [] }, optionsChart)
    },
    frequencia : {
        arrFrequencia : [],
        chartFrequencia : new Chartist.Line('#chart-frequencia', { series: [] }, optionsChart)
    }
}

function setInfo(info, data){
    
    if(Math.abs(data - info.defaultValue) > info.rangeMax){
        info.element.style.setProperty("--colorType", "darkred")
        info.element.style.setProperty("--animationType", "blink 0.5s infinite")
        alertCount++
    }
    else{   
        if(Math.abs(data - info.defaultValue) > info.rangeMin){
            info.element.style.setProperty("--colorType", "gold")
            info.element.style.setProperty("--animationType", "none")
        }
        else{
            info.element.style.setProperty("--colorType", "green")
            info.element.style.setProperty("--animationType", "none")
        } 
    }

    info.elementTxt.innerHTML = data.toFixed(1)
}

function fetchData(){
    fetch("/get-last")
        .then(function(res){ 
            res.json()
                .then(function(data){
                    alertCount = 0
                    
                    setInfo(info.tensao, data[0].tensao)
                    setInfo(info.corrente, data[0].corrente)
                    setInfo(info.potencia, data[0].potencia)
                    setInfo(info.frequencia, data[0].frequencia)

                    isFirstLoop ? isFirstLoop = false : alertCount > alertCountLimit ? startAlert() : stopAlert()
                })
        })
}

function fetchAllData(){
    fetch("/get-all")
        .then(function(res){ 
            res.json()
                .then(function(data){
                    chart.tensao.arrTensao = []
                    chart.corrente.arrCorrente = []
                    chart.potencia.arrPotencia = []
                    chart.frequencia.arrFrequencia = []
                    data.forEach(element => {

                        chart.tensao.arrTensao.unshift(element.tensao)
                        chart.corrente.arrCorrente.unshift(element.corrente)
                        chart.potencia.arrPotencia.unshift(element.potencia)
                        chart.frequencia.arrFrequencia.unshift(element.frequencia)
                    });
                    
                    chart.tensao.chartTensao.update({ series: [chart.tensao.arrTensao] })
                    chart.corrente.chartCorrente.update({ series: [chart.corrente.arrCorrente] })
                    chart.potencia.chartPotencia.update({ series: [chart.potencia.arrPotencia] })
                    chart.frequencia.chartFrequencia.update({ series: [chart.frequencia.arrFrequencia] })
                })
        })
}

function startInfo(){
    boxInfo.style.setProperty("--translate", "-110%")
    initBox.style.display = "none"
    timerFetch = window.setInterval(fetchData, timerValue)
}

function stopInfo(){
    boxInfo.style.setProperty("--translate", "150%")
    initBox.style.display = "block"
    clearInterval(timerFetch)
    stopAlert()
}

function startAlert(){
    if(!alertStatus){
        alertElement.style.display = "block"
        alertStatus = true
    }
}

function stopAlert(){
    if(alertStatus){
        alertElement.style.display = "none"
        alertStatus = false
    }
}

function startChart(){
    document.querySelector("#chart").style.setProperty("--animationType", "open-chart 0.5s 1")
    document.querySelector("#chart").style.left = "0%";
    timerFetchAll = window.setInterval(fetchAllData, timerValue)
}

function stopChart(){
    document.querySelector("#chart").style.setProperty("--animationType", "close-chart 0.5s 1")
    document.querySelector("#chart").style.left = "100%";
    clearInterval(timerFetchAll)
}

fetchData()

document.querySelector("#chart-menu").addEventListener("click", function(){
    startChart()
})

document.querySelector("#close-chart").addEventListener("click", function(){
    stopChart()
})

document.addEventListener("markerFound", function(){
    startInfo()
})

document.addEventListener("markerLost", function(){
    stopInfo()
})