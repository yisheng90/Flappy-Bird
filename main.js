var width = 1200
var height = 300
var poles = []
var nextPole = 0
var point = 0

var bird = {
  x: null,
  y: null,
  width: 40,
  height: 40,
  keyDown: 0,
  update: function () {
    // console.log(this.keyDown === 38)
    if (this.keyDown === 87) {
      if (this.y > 0) {
        this.y -= 10
      }
    } else if (this.keyDown === 83) {
      if (this.y < height) {
        this.y += 10
      }
    }

    $('.bird').css({
      top: this.y
    })
  }
}

function Pole (left, height) {
  this.x = left
  this.y = 0
  this.width = 40
  this.height = height
  this.gap = 50
}

Pole.prototype.update = function (i) {
  this.x = $('.pole' + i).position().left
  // console.log('x', this.x)
  if (this.x > 0) {
    this.x -= 2
  } else if (this.x < width) {
    var num = Math.floor(Math.random() * (height - this.gap))
    this.height = num
    this.x = width
  }
  $('.pole' + i).css({
    left: this.x,
    height: this.height,
    width: this.width
  })
  $('.poleBottom' + i).css({
    left: this.x,
    top: this.y + this.height + this.gap,
    width: this.width,
    height: 400 - (this.y + this.height + this.gap) + 'px'
  })
}

function init () {
  $('body').append('<div class="gameBox"></div>')
  $('body').append('<div class="result">Points: <span>0</span></div>')

  poles.push(new Pole(1300, 100))
  poles.push(new Pole(1600, 200))
  poles.push(new Pole(1900, 150))
  poles.push(new Pole(2100, 300))

//  console.log(poles.length)
  // console.log(poles[0])
  for (var i = 0; i < poles.length; i++) {
    $('.gameBox').append('<div class="pole pole' + i + '"></div>')
    $('.gameBox').append('<div class=" pole poleBottom' + i + '"></div>')
    $('.pole' + i).css({
      left: poles[i].x
    })
    $('.poleBottom' + i).css({
      left: poles[i].x,
      height: 400 - poles[i].height - poles[i].gap + 'px'
    })

    poles[i].update(i)
  }

  $('.gameBox').append('<div class="bird"></div>')
  $('.bird').append('<img src="bird.gif">')

  $('body').append('<button>Start</button>')
  $('body button').click(function () {
    $('button').remove()
    update()
  })

  bird.x = $('.bird').position().left
  bird.y = $('.bird').position().top
}

function update () {
  var interval = setInterval(function () {
    for (var i = 0; i < poles.length; i++) {
      poles[i].update(i)
    }

    intersecpt()
    if (poles[nextPole].x < bird.x) {
      if (nextPole === poles.length - 1) {
        nextPole = 0
      } else {
        nextPole += 1
      }
      point += 1
      updateResult()
    }

    if (intersecpt() === true) {
      clearInterval(interval)
      showGameOver()
    }
  }, 30)

  var birdInterval = setInterval(function () {
    if (intersecpt() === true) {
      clearInterval(birdInterval)
    } else {
      bird.update()
      bird.keyDown = 0
    }
  }, 100)
}

function intersecpt () {
  console.log('bird', bird.x);
    console.log('nextPole', nextPole, poles[nextPole].x);
  if ((bird.x + bird.width / 2) >= poles[nextPole].x && (bird.y) < poles[nextPole].height) {
    return true
  } else if ((bird.x + bird.width / 2) >= poles[nextPole].x && (bird.y + bird.height) > (poles[nextPole].height + poles[nextPole].gap)) {
    return true
  }
  return false
}

function updateResult () {
  $('.result span').text(point)
}

function showGameOver () {
  $('.gameBox').text('Game Over')
.append('<button>Play Again</button>')

  $('.gameBox button').click(function () {
    $('.gameBox').remove()
    $('.result').remove()
    poles = []
    point = 0
    init()
  })
}

$(document).ready(function () {
  init()

  $('body').keydown(function (event) {
    bird.keyDown = event.which
  })
})
