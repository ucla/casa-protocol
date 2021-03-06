var VIEWER = new function(){
    
    this.page = false;
    
    this.go = function(name, fade){

        var page,
            viewer = this,
            fadeTime = typeof fade == 'undefined' ? 400 : parseInt(fade),
            anchor;
        name = name.toLowerCase().split(':')
        if(name.length > 1){
            anchor = name[1];
            name = name[0];
        }else{
            name = name[0];
            anchor = false;
        }

        if(name != this.page){
            
            $('#content, #colophon').fadeOut(fadeTime, function(){

                $('#content').html('');

                viewer.page = name;

                try{
                    page = new EJS({url: 'page/'+name+'.ejs'});
                }catch(e){
                    page = new EJS({url: 'page/error/404.ejs'});
                }

                $('#content').append(page.render(viewer));
                $('#content > :not(header)').find('h1').each(function(){
                    var ref = $(this).attr('data-ref') ? $(this).attr('data-ref') : $(this).text();
                    ref = ref.toLowerCase().replace(/ /g,'-').replace(/:/g, '-').replace(/\./, '-');
                    var count = false;
                    if($('#s-'+ref).length > 0){
                        count = 1;
                        while($('#s-'+ref+'_'+count).length > 0)
                            count++;
                    }
                    if(count){
                        $(this).attr('id', 's-'+ref+'_'+count);
                    }else{
                        $(this).attr('id', 's-'+ref);
                    }
                })

                $('#content a:not([rel="external"])').each(function(){
                    var href = $(this).attr('href');
                    if(href){
                        href = href.replace('#',':')
                        if(href.indexOf(':') === 0){
                            href = name+href;
                        }
                        href = '#'+href;
                        $(this).attr('href',href);
                    }
                })
                
                $('#content a[rel="external"]').each(function(){
                    $(this).attr('target', '_blank');
                })

                $('#content').ariaMapper();
                
                var statuses = {
                    'non-normative': 'This section is non-normative',
                    'conflict': 'This section is flagged as in conflict',
                    'editor-challenged': 'This section is flagged as challenged by the editor',
                    'council-challenged': 'This section is flagged as challenged by the council',
                    'revision': 'This section is flagged for revision',
                    'incomplete': 'This section is flagged as incomplete',
                    'stub': 'This section is flagged as a stub'
                };
                var issueStatuses = ['conflict','editor-challenged','council-challenged','revision','incomplete','stub'];
                
                // requires aria mappings
                $('[data-status]').each(function(){
                    var status = $(this).attr('data-status')
                    if(statuses[status]){
                        $(this).addClass('status_section').addClass(status);
                        if($.inArray(status, issueStatuses) >= 0)
                            $(this).addClass('issue')
                        var str  = '<footer role="status" class="status_message">';
                        str += '<h1>'+statuses[status]+'</h1>';
                        if($(this).attr('data-message'))
                            str += '<p>'+$(this).attr('data-message')+'</p>';
                        str += '</footer>';
                        if($(this).find('#'+$(this).attr('aria-labeledby')).length)
                            $(this).find('#'+$(this).attr('aria-labeledby')).after(str)
                        else
                            $(this).addClass('no-header').prepend(str)
                    }
                });

                document.title = $('#content > header > *:not(hgroup), #content > header > hgroup > *').map(function(){ 
                    return $(this).text().replace('Community App Sharing Architecture','CASA'); 
                }).get().join(' - ');

                $('#hide_non-normative').change();
                $('#show_issues-only').change();
                $('#hide_status-notices').change();
                $('#hide_code').change();

                $('[data-lang]').each(function(){
                    $(this).addClass('prettyprint');
                    if($(this).attr('data-lang'))
                           $(this).addClass('lang-'+$(this).attr('data-lang'))
                })

                // This is an array of functions that chain through themselves
                var loadChain = [

                    // Load JSON schema from sub-component of the protocol schema
                    function(idx){
                        if($('[data-schema]').length == 0)
                            loadChain[idx+1](idx+1);
                        else{
                            $.get('support/schema.json', function(data){
                                $('[data-schema]').each(function(){
                                    $(this).addClass('prettyprint')
                                        .addClass('lang-json')
                                        .html(JSON.stringify(data.definitions[$(this).attr('data-schema')], null, 2));
                                })
                                loadChain[idx+1](idx+1);
                            })
                        }
                    },

                    // Load JSON schema from a schema file for an attribute
                    function(idx){
                        if($('[data-attribute-schema]').length == 0)
                            loadChain[idx+1](idx+1);
                        else{
                            var ajaxRequests = [],
                                requested = [];
                            $('[data-attribute-schema]').each(function(){
                                var $ele = $(this),
                                    attribute = $ele.attr('data-attribute-schema');
                                if(requested.indexOf(attribute) === -1){
                                    requested.push(attribute);
                                    ajaxRequests.push($.get('support/attributes/'+attribute+'/schema.json', function(data){
                                        $ele.addClass('prettyprint')
                                            .addClass('lang-json')
                                            .html(JSON.stringify(data, null, 2));
                                    }));
                                }
                            })
                            $.when.apply( $, ajaxRequests ).then(function() {
                                loadChain[idx+1](idx+1);
                            }, function() {
                                loadChain[idx+1](idx+1);
                            });
                        }
                    },

                    // Finish rendering the page
                    function(idx){
                        prettyPrint();
                        $('body').scrollTop(0)
                        $('#content, #colophon').fadeIn(fadeTime, function(){
                            if(anchor && $('#s-'+anchor).length > 0){
                                $("html,body").animate({ scrollTop: $('#s-'+anchor).position().top - 30 }, "slow")
                            }
                        });
                    }
                ];

                // Start the loadChain that concludes with render completion
                loadChain[0](0);
            
            });
        
        }else{
            
            if(anchor && $('#s-'+anchor).length > 0){
                $("html,body").animate({ scrollTop: $('#s-'+anchor).position().top - 30 }, "slow")
            }
            
        }
    };
    
}