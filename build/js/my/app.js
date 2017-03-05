"use strict";

document.addEventListener('DOMContentLoaded', function(){  

  // function Btn(width, height) {
  //   this.width = width || 50;
  //   this.height = height || 50;
  //   this.elm = null;
  // }

  // Btn.prototype.render = function(whare){
  //   if (this.elm) {
  //     this.elm.style.width = this.width + 'px';
  //     this.elm.style.height = this.height + 'px';
  //   }

  //   whare.appendChild(this.elm);
  // }

  // function button(width, height, text){
  //   Btn.call(this, width, height);

  //   this.text = text || 'Default';
  //   var btn = document.createElement('BUTTON');
  //   var label = document.createTextNode(text);

  //   btn.appendChild(label);
  //   this.elm = btn;
  // }

  // button.prototype = Object.create( Btn.prototype );
  // // button.prototype.constructor = button;

  // button.prototype.render = function(whare){
  //   Btn.prototype.render.call(this, whare);

  //   this.elm.addEventListener('click', this.onClick.bind(this), false);
  // }

  // button.prototype.onClick = function(e) {

  //   var paragraph = document.createElement('P');
  //   var label = document.createTextNode(this.text);
  //   paragraph.appendChild(label);
  //   document.body.appendChild(paragraph);
  //   console.log(`button ${this.text} clicked`);
  // }

  // var btn1 = new button('100', '50', 'button 1');
  // var btn2 = new button('130', '50', 'button 2');

  // btn1.render(document.body);
  // btn2.render(document.body);

  //OOLO pattern

  // var Btn = {
  //   init: function(width, height) {
  //     this.width = width;
  //     this.height = height;
  //     this.elm = null;
  //   },

  //   render: function(whare) {
  //     if (this.elm) {
  //       this.elm.style.width = this.width + 'px';
  //       this.elm.style.height = this.height + 'px';
  //     }
  //     whare.appendChild(this.elm);
  //   }
  // }

  // var Button = Object.create(Btn);

  // Button.setup = function(width, height, text) {
  //   this.init(width, height);
  //   this.text = text || 'Default';

  //   var btn = document.createElement('BUTTON');
  //   var label = document.createTextNode(text);
  //   btn.appendChild(label);

  //   this.elm = btn;
  // }

  // Button.build = function(whare) {
  //   this.render(whare);
  //   this.elm.addEventListener('click', this.onClick.bind(this));
  // }

  // Button.onClick = function(e) {
  //   console.log(this.text);
  // }

  // var btn1 = Object.create( Button );
  // btn1.setup('120', '30', 'button 1');

  // var btn2 = Object.create( Button );
  // btn2.setup('200', '50', 'button 2');

  // btn1.build(document.body);
  // btn2.build(document.body);


  function Link(link) {
    this.link = link;
  }

  Link.prototype.getNode = function() {
    var li = document.createElement('a');
    li.style.cursor = 'pointer';
    li.classList.add('list-group-item');
    li.innerText = this.link;
    return li;
  }


  function Menu(links) {
    this.links = links.map(function(link){
      return new Link(link);
    });
  }

  Menu.prototype.getNode = function(){
    var container = document.createElement('div');
    container.classList.add('list-group');

    this.links.forEach(function(link){
      container.appendChild(link.getNode());
    });

    return container;
  }

  function ContextMenu(links) {
    Menu.call(this, links);
    this.container = this.render();
    this.listener();
  }

  ContextMenu.prototype = Object.create( Menu.prototype );
  ContextMenu.prototype.constructor = ContextMenu;

  ContextMenu.getCoords = function(elm) {
    let box = elm.getBoundingClientRect();

    return {
      top: box.top,
      left: box.left,
      right: document.body.clientWidth - box.right,
      bottom: document.body.clientHeight - box.bottom,
      width: box.right - box.left,
      height: box.bottom - box.top
    }
  }

  ContextMenu.prototype.getNode = function() {
    return Menu.prototype.getNode.call(this);
  }

  ContextMenu.prototype.render = function(whare = document.body) {
    var container = document.createElement('div');
    container.classList.add('contextmenu', 'hidden');
    container.appendChild(Menu.prototype.getNode.call(this));
    whare.appendChild(container);
    return container;
  }

  ContextMenu.prototype.show = function(evt){
    evt.preventDefault();
    let menuNode = this.container;
    
    if (evt.type !== 'click') {
      menuNode.classList.toggle('hidden');
    } else {
      menuNode.classList.add('hidden');
    }
    this.coodrs(evt);
  }

  ContextMenu.prototype.coodrs = function(evt){
    evt.preventDefault();
    let menuNode = this.container;
    
    let pos = {
      'x': evt.x,
      'y': evt.y
    }
    
    menuNode.style.top = `${pos.y}px`;
    menuNode.style.left = `${pos.x}px`;
    let coords = this.constructor.getCoords;

    console.log(`top: ${coords(menuNode).top}, right ${coords(menuNode).right}, bottom ${coords(menuNode).bottom}, left ${coords(menuNode).left}`);

    if (coords(menuNode).right < 0) {
      menuNode.style.left = `${pos.x - coords(menuNode).width}px`;
      console.log('out right!');
    }

    if(coords(menuNode).bottom < 0) {
      menuNode.style.top = `${pos.y - coords(menuNode).height}px`;
      console.log('out bottom!');
    }
  }

  ContextMenu.prototype.listener = function() {
    let menu = ContextMenu.prototype.show.bind(this);
    let menuCoords = ContextMenu.prototype.coodrs.bind(this);

    document.body.addEventListener('click', menu, false);
    document.body.addEventListener('contextmenu', menu, false);
  }

  new ContextMenu(['menu item 1', 'menu item 2', 'menu item 3']);
});