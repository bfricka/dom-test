class DomTest
  constructor: (@type = 'clone', @runs = 500) ->
    @setupElements()

  templates:
    clone: null
    inner: null
    innerArr: null

  setupElements: ->
    @templates.clone = @dispose @q('#test-container .row')
    @container = @empty @q('#test-container')

  run: (runs = @runs, type = @type) ->
    @empty @container
    switch @type
      when 'clone' then @_runClone(runs)
      when 'cloneFrag' then @_runCloneFrag(runs)
      when 'inner' then @_runInner(runs)
      when 'innerArr' then @_runInnerArr(runs)
    return

  _runClone: (runs) ->
    while runs--
      row = @templates.clone.cloneNode(true)
      @container.appendChild(row)
    return

  _runCloneFrag: (runs) ->
    tmpl = document.createDocumentFragment()

    while runs--
      tmpl.appendChild(@templates.clone.cloneNode(true))

    @container.appendChild tmpl
    return

  _runInner: (runs) ->
    tmpl = ""

    while runs--
      tmpl += @_getRowStr()

    @container.innerHTML += tmpl
    return

  _runInnerArr: (runs) ->
    tmpl = []

    while runs--
      tmpl.push @_getRowArr()

    @container.innerHTML += tmpl.join('')
    return

  _getRowStr: ->
    cols = 3
    tmpl = '<div class="row">'

    while cols--
      tmpl += @_getColumnStr()

    tmpl += '</div>'
    tmpl

  _getColumnStr: ->
    tmpl = '<div class="span4">' +
      '<h2>Heading</h2>' +
        '<p>Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui.</p>' +
        '<p>'+
          '<a href="#" class="btn">View details »</a>'+
        '</p>'+
    '</div>'

    tmpl

  _getRowArr: ->
    cols = 3
    tmpl = ['<div class="row">']

    while cols--
      tmpl.push('<div class="span4">')
      tmpl.push('<h2>Heading</h2>')
      tmpl.push('<p>Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui.</p>')
      tmpl.push('<p>')
      tmpl.push('<a href="#" class="btn">View details »</a>')
      tmpl.push('</p>')
      tmpl.push('</div>')

    tmpl.push('</div>')
    tmpl.join('')

  q: (selector) ->
    document.querySelector selector

  qA: (selector) ->
    document.querySelectorAll selector

  empty: (el) ->
    while el.firstChild
      el.removeChild el.firstChild

    el

  dispose: (el) ->
    el.parentNode.removeChild el

window.DomTest = DomTest