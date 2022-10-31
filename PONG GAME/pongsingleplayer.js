/***
*
*  $PONG
*
*  Autor do Projeto:              Pedro Amarilho Almeida Macedo
*
*  Projeto: Jogo Pong - Curso de Lógica de Programação
*
*  $HA Histórico de evolução:
*  Data        Observações
*  04/10/2022       Início do desenvolvimento
*  10/10/2022       $Des.
*  18/10/2022       Implementação das funções de desenho da bolinha e raquetes, colisão da bolinha com as bordas e com as raquetes
*  25/10/2022       Inserção da biblioteca p5.collide2d
*  01/11/2022       Implementação de funções de som, placar, timer e desenho do campo 
*  02/11/2022       Implementação da função de reset da bolinha no centro da tela 
*  15/11/2022       Resolução dos bugs nas funções de dificuldade do oponente 
*  28/11/2022       Refatoração das funções e finalização do projeto
*
***/

// Configurações de Tela(Canvas)
var canvas_W = 900;
var canvas_H = 600;

// Variáveis de posicionamento e tamanho da bolinha
var circle_X = 450;
var circle_Y = 200;
var circle_Diameter = 20;
var circle_R = circle_Diameter / 2;

// Variáveis de Movimentação da Bolinha
var circle_Velocity_X = 4;
var circle_Velocity_Y = 4;

// Parâmetros de tamanho da(s) raquete(s)
var racket_H = 50;
var racket_W = 10;

// Variáveis de posicionamento da Raquete do Jogador (racket_Player)
var racket_Player_X = 100;
var racket_Player_Y = 200;

// Variáveis de posicionamento da Raquete do Oponente (racket_Opponent)
var racket_Opponent_Y = 200;
var racket_Opponent_X = 790;

// Números iniciais da pontuação do Jogador e do Oponente (Score)
var score_P = 0;
var score_O = 0;

// Verificação de Colisão (collideRectCircle)
var collision = false;

// Variáveis de carregamento dos sons utilizados no jogo
var sound_Racket;
var sound_Point;
var sound_Track;

// Variação de Dificuldade
var error_Chance = 0;

// Carregamento dos sons utilizados no jogo 
function preload() {
  sound_Track = loadSound ("Fireplace (mp3cut.net).mp3");
  sound_Racket = loadSound ("Tennis Serve - Sound Effect.mp3");
  sound_Point = loadSound ("D-Trumpet.mp3");
};

// Função de definição dos parâmetros básicos da tela de jogo e som ambiente
function setup() {
  createCanvas(canvas_W, canvas_H);
  sound_Track.loop();
  sound_Racket.play(); 
};

// Parâmetros dos elementos de decoração do jogo/campo
function field_Complements()  {
  stroke(255)
  fill (color(60, 179, 113))
  rect (75, 150, 750, 300)
  fill(255)
  rect(450, 150, 5, 300)
  fill(255)
  rect(455, 300,167.5,1)
  fill(255)
  rect(287.5, 300,167.5,1)
  fill(255)
  rect(287.5, 150, 1, 300)
  fill(255)
  rect(622.5, 150, 1, 300)
  stroke(150)
  fill (150)
  circle(452.5, 150, 15)
  fill (150)
  circle(452.5, 450, 15)
  textAlign(CENTER)
  textSize(50)
  textFont('Times')
  stroke(255)
  fill(255)
  text("PONG", 450, 60);
};

// Desenha a ''Bolinha''
function show_Circle() {
  stroke(255);
  fill(255);
  circle(circle_X, circle_Y, circle_Diameter);
};

// Definições de movimento e velocidade da ''Bolinha''
function movement_Circle() {
  circle_X += circle_Velocity_X;
  circle_Y += circle_Velocity_Y;
};

// Verificação de colisões da ''Bolinha''
function verify_HitCircle() {
  if(circle_X + circle_R > canvas_W || circle_X - circle_R < 0 ) {
    circle_Velocity_X *= -1;
  }
  if(circle_Y + circle_R > canvas_H || circle_Y - circle_R < 0) {
    circle_Velocity_Y *= -1;
  }
};

// Desenha a ''Raquete'';
function show_Racket(x,y) {
  if( x == racket_Player_X) {
    fill(color(21, 86, 185));
    stroke(255);
  } 
  else {
    fill(color(204, 73, 35));
    stroke(255);
  }
  rect(x,y,racket_W,racket_H);
}

// Define a movimentação da ''Raquete do Jogador'';
function racket_PlayerMovement() {
  if(keyIsDown(UP_ARROW)) {
    racket_Player_Y -= 10;
  }
  if(keyIsDown(DOWN_ARROW)) {
    racket_Player_Y += 10;
  }
};

// Verifica a interação entre a ''Bolinha'', as ''Raquetes'' e as ''Bordas'' 
// Parâmetros da função utilizados a partir da biblioteca p5.collid2d.js
function verify_Hit_Library(x, y,) {
  collision = collideRectCircle(x, y, racket_W, racket_H, circle_X, circle_Y, circle_Diameter)
  if(collision) {
    circle_Velocity_X *= -1
    sound_Racket.play();
  }
};

// Função que desenha os placares do ''Jogador'' e do ''Oponente''
function include_Score() {
  stroke (255);
  textAlign (CENTER);
  textSize (16);
  fill (color(21, 86, 185));
  rect (250, 10, 40, 20);
  fill (255);
  text (score_P, 270, 26);
  fill (color(204, 73, 35));
  rect (610, 10, 40, 20)
  fill (255);
  text (score_O, 630, 26);
};

// Função que faz a verificação de contato com as bordas da tela e sinaliza a pontuação para o ''Jogador'' ou ''Oponente''
function verify_Score() {
  if(circle_X + circle_R > 900) {
    score_P += 1;
    setTimeout(function() {    
      circle_X = 450;
      circle_Y = 200;
      verify_HitCircle}, 500)
      sound_Point.play();
  }
  if (circle_X - circle_R < 0) {
    score_O += 1;
    setTimeout(function() {    
      circle_X = 450;
      circle_Y = 200;
      verify_HitCircle}, 500)
      sound_Point.play();
  }
};

// Função que desenha o marcador de tempo da partida
function include_Timer() {
  timer = millis();
  timer = int(timer / 1000);
  textAlign(CENTER);
  textSize(25);
  stroke(255);
  fill(255);
  text(timer, 450, 100)
  textFont();
};

// Função que define o aumento e o limite da dificuldade acrescentada à ''Raquete do Oponente''
function estimate_ChanceError() {
  if (score_O >= score_P) {
    error_Chance += 1;
    
  if (error_Chance >= 83) {
      error_Chance = 84;
    }
  } 
  else {
    error_Chance -= 1;
    if (error_Chance <= 15) {
      error_Chance = 15;
    }
  }
};

// Define a movimentação da ''Raquete do Oponente''
function racket_OpponentMovement() {
  var racketOpponent_Velocity_Y;

  racketOpponent_Velocity_Y = circle_Y - racket_H / 2 - 30;
  racket_Opponent_Y = racketOpponent_Velocity_Y + error_Chance;
  estimate_ChanceError();
};

//Verificação de colisões das ''Raquetes'' com a borda da tela/campo
function verify_PlayerHitBorder() {
  if(racket_Player_Y + racket_H >= canvas_H) {
   racket_Player_Y = 550;
  }
  if(racket_Player_Y <= 0) {
    racket_Player_Y = 0;
    }
};

function draw() {
  background(color(60, 179, 113));
  field_Complements();
  show_Circle(); 
  movement_Circle();
  verify_HitCircle();
  show_Racket(racket_Player_X, racket_Player_Y,);
  show_Racket(racket_Opponent_X, racket_Opponent_Y); 
  racket_PlayerMovement();
  verify_Hit_Library(racket_Player_X, racket_Player_Y);
  verify_Hit_Library(racket_Opponent_X, racket_Opponent_Y);
  estimate_ChanceError();
  racket_OpponentMovement();
  verify_PlayerHitBorder();
  include_Score();
  include_Timer();
  verify_Score();
};
