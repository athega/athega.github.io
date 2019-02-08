---
title: "Sinatra och Google Spreadsheet"
date: 2009-03-08
last_updated_by: peter
---
Efter att ha sett scriptet <a href="http://github.com/timhaines/iphone-dev-tweeters-/blob/edf4ea86f3f6c9b425d2fe7cb22ba394560ed378/follow_iphone_devs.rb">follow_iphone_devs.rb</a> fick jag idén att kombinera <a href="http://www.sinatrarb.com/">Sinatra</a> och <a href="http://github.com/gimite/google-spreadsheet-ruby/tree/master">google-spreadsheet-ruby</a> som ett exempel på vad man kan göra i Ruby om man inte har behov av ett större ramverk som <a href="http://rubyonrails.org/">Ruby on Rails</a>.

<a href="http://www.sinatrarb.com/"><img class="size-full wp-image-73 alignnone" src="/assets/legacy/uploads/2009/03/sinatra.png" alt="Sinatra" width="315" height="73" /></a>

Sinatra är ett DSL för att snabbt och enkelt skapa webbapplikationer i Ruby:

    # myapp.rb
    require 'rubygems'
    require 'sinatra'
    get '/' do
      'Hello world!'
    end

<h2>Komma igång</h2>
Först av allt behöver vi <a href="http://www.ruby-lang.org/en/">Ruby</a> och <a href="http://www.rubygems.org/">RubyGems</a>. Eftersom jag använder OS X så är de redan installerade. (Men se till att du har en uppdaterad version av RubyGems)

Om du inte redan har lagt till <a href="http://github.com">GitHub</a> i listan över dina gem sources:

    gem sources -a http://gems.github.com

Nu är vi redo att installera de gems vi kommer att använda:

    sudo gem install sinatra gimite-google-spreadsheet-ruby haml

Nu är vi redo att börja skriva vårt script:

<h2>sinatra-and-google-spreadsheet.rb</h2>

Först tar vi och laddar in de gems vi kommer använda (Sinatra kommer att ladda in <a href="http://haml.hamptoncatlin.com/">Haml</a> åt oss):


    require 'rubygems'
    require 'sinatra'
    require 'google_spreadsheet'

Nu tar vi och aktiverar sessioner:

    # We want to save the posts in a session variable
    set :sessions, true

<blockquote><b>OBS:</b> Detta är självklart ingen lösning som skalar men det fungerar bra för vårt syfte.</blockquote>


Metoderna för att hämta datat från Google Spreadsheet:

    def get_posts
      # Retrieve and return the posts
      session["posts"] ||= retrieve_posts
    end
    
    def retrieve_posts
      # Empty posts hash
      posts = {}
    
      # Log in to Google Spreadsheet
      session = GoogleSpreadsheet.login('xxxxxxxx', 'xxxxxxxx')
    
      # First worksheet of 
      #  http://spreadsheets.google.com/ccc?key=peGTxx6h1WT0ihw9-QETbQg
      ws = session.spreadsheet_by_key("peGTxx6h1WT0ihw9-QETbQg").worksheets[0]
    
      # Iterate over all the rows in the spreadsheet
      for i in 1...ws.num_rows
        # Store the data Identify data using the slug
        posts[ws[i+1,5]] = {
          :title    => ws[i+1,1],
          :content  => ws[i+1,2],
          :date     => Date.parse(ws[i+1,3]),
          :author   => ws[i+1,4],
        }
      end
    
      # Return the retrieved posts
      posts
    end

<blockquote>Vi använder memoization för att det bara ska bli en förfrågning till Google per session</blockquote>

Startsida listar helt enkelt alla poster:

    get '/' do
      # Get all the posts
      @posts = get_posts
      
      # Render the index template
      haml :index
    end

Respektive post har en "slug" som används i urlen:

    get '/:slug' do
      # Get the post
      @post = get_posts[params[:slug]]
      
      # Render the post template
      haml :post
    end

Nu definierar vi de <a href="http://haml.hamptoncatlin.com/">Haml</a>-mallar vi använder på sidorna:

    __END__
    
    @@ layout
    %html
      %head
        %title Sinatra and Google Spreadsheet
      %body
        = yield
    
    @@ index
    %h1.title All posts
    
    - @posts.each do |slug, post|
      %ul
        %li
          %a{:href => slug}
            = post[:title]
    @@ post
    %h1.title
      = @post[:title]
    
    %div
      Published
      %span.date
        = @post[:date]
      by
      %span.author
        = @post[:author]
    
    %p.content
      = @post[:content]
    
    %a{:href => '/'} << Back

<h2>Starta scriptet</h2>

    $ ruby sinatra-and-google-spreadsheet.rb 
    == Sinatra/0.9.1 has taken the stage on 4567 for development with backup from Thin
    >> Thin web server (v1.0.0 codename That´s What She Said)
    >> Maximum connections set to 1024
    >> Listening on 0.0.0.0:4567, CTRL+C to stop

Om allt går som det ska så ska vi nu ha en server på <a href="http://localhost:4567/">http://localhost:4567/</a>.

<h2>Resultat</h2>

Från ett kalkylblad på Google Spreadsheet:

<img src="/assets/legacy/uploads/2009/03/data-for-the-sinatra-google-spreadsheet.png" alt="Data från Google Spreadsheet" title="Kalkylbladet som innehåller datat" width="640" height="416" class="size-full wp-image-90" />

Till en sida serverad med Sinatra:

<img src="/assets/legacy/uploads/2009/03/sinatra-and-google-spreadsheet.png" alt="Post om Ruby" title="Post om Ruby" width="464" height="227" class="size-full wp-image-86" />

Att man kan åstadkomma så mycket med under 100 rader Rubykod är rätt imponerande, speciellt om man tänker på att vi då även räknar in kommentarer och mallar.

// [Peter](/peter)
