/*******Tech Stack Js**** */
$('body').on('keyup','#teckstackpop-search', function() {  
    var searchValue = $(this).val().toLowerCase();
    var practice_industry = jQuery('#practice_industry').val();
    $('#phone-provider-popup .item').each(function() {
      var itemText = $(this).find('label').text().toLowerCase();
      if (itemText.includes(searchValue)) {
        if(practice_industry=='Optometry'){
          if($(this).find('input').hasClass('opto')){
            $(this).show();
            }
            else{
              $(this).hide();
            }
        }
        else{
          if($(this).find('input').hasClass('dental')){
            $(this).show();
            }
            else{
              $(this).hide();
            }
        }
        
      } else {
        $(this).hide();
      }
    });
  });
  $('body').on('keyup','#teckstackpop-other-search', function() {  
    var searchValue = $(this).val().toLowerCase();
    var practice_industry = jQuery('#practice_industry').val();
    $('#other-provider-popup .item').each(function() {
      var itemText = $(this).find('label').text().toLowerCase();
      if (itemText.includes(searchValue)) {
        if(practice_industry=='Optometry'){
          if($(this).find('input').hasClass('opto')){
            $(this).show();
            }
            else{
              $(this).hide();
            }
        }
        else{
          if($(this).find('input').hasClass('dental')){
            $(this).show();
            }
            else{
              $(this).hide();
            }
        }
      } else {
        $(this).hide();
      }
    });
  });
  $('body').on('keyup','#teckstackpop-anlytics-search', function() {  
    var searchValue = $(this).val().toLowerCase();
    var practice_industry = jQuery('#practice_industry').val();
    $('#analytics-provider-popup .item').each(function() {
      var itemText = $(this).find('label').text().toLowerCase();
      if (itemText.includes(searchValue)) {
        if(practice_industry=='Optometry'){
          if($(this).find('input').hasClass('opto')){
            $(this).show();
            }
            else{
              $(this).hide();
            }
        }
        else{
          if($(this).find('input').hasClass('dental')){
            $(this).show();
            }
            else{
              $(this).hide();
            }
        }
      } else {
        $(this).hide();
      }
    });
  });
  $('body').on('keyup','#teckstackpop-verification-search', function() { 
    var searchValue = $(this).val().toLowerCase();
    $('#verification-provider-popup .item').each(function() {
      var itemText = $(this).find('label').text().toLowerCase();
      if (itemText.includes(searchValue)) {
        $(this).show();
      } else {
        $(this).hide();
      }
    });
  });

  $('body').on('keyup','#current_phone_provider_price,#current_patient_texting_price,#current_reminders_recall_price,#current_digital_forms_price,#current_treatment_pre_pay_plan_price,#current_paytments_provider_price,#current_reviews_price,#current_online_scheduling_price,#current_mass_texting_price,#current_mass_emailing_price,#current_analytics_morning_huddle_price,#current_verification_provider_price', function() {
    $(this).parent().prev().attr('data-pricing',$(this).val());
    updateTotal();
  });


  
  
jQuery('body').on('click','.techstack-cp-btn',function() { 
  var patient_texting_val=$('#current_patient_texting_select').attr('data-value');
  if(patient_texting_val!=""){
  $(this).next().attr('data-value',patient_texting_val);
  $(this).next().html('<span>'+patient_texting_val+'</span>');
  updateValue();
  }
});

jQuery('body').on('click','.techstackfield-selct',function() {   
   
  var provider_for=$(this).attr('data-provider');  
  var selection_id=$(this).attr('data-selection');   
  var current_value=$('#'+selection_id).attr('data-value');
  if(current_value){
   
  if(current_value.indexOf('Other') !== -1){
    var arr=current_value.split('Other: ');    
    current_value='Other';
    if(provider_for=='other-provider'){
      $('#otherOtherProvider').val(arr[1]);
      $('#other-other-provider-div').show();
    }
    else if(provider_for=='phone-provider'){
      $('#otherPhoneProvider').val(arr[1]);
      $('#other-phone-provider-div').show();
    }
    else if(provider_for == 'verification-provider'){
      $('#otherVerificationProvider').val(arr[1]);
      $('#other-verification-provider-div').show();
    }
    else{
      $('#otherAnalyticsProvider').val(arr[1]);
      $('#other-analytics-provider-div').show();
    }
  }
  else{
    $('#otherOtherProvider').val('');
    $('#other-other-provider-div').hide();
    $('#otherPhoneProvider').val('');
    $('#other-phone-provider-div').hide();
    $('#otherAnalyticsProvider').val('');
    $('#other-analytics-provider-div').hide();
    $('#otherVerificationProvider').val('');
    $('#other-verification-provider-div').hide();
  }
  $("input[name='"+provider_for+"']").each(function(e) {        
    if ($(this).val() == current_value) { 
      $(this).prop('checked',true); 
    }
  });
  }
  else{
    $('#otherOtherProvider').val('');
    $('#other-other-provider-div').hide();
    $('#otherPhoneProvider').val('');
    $('#other-phone-provider-div').hide();
    $('#otherAnalyticsProvider').val('');
    $('#other-analytics-provider-div').hide(); 
    $('#otherVerificationProvider').val('');
    $('#other-verification-provider-div').hide();   
    $("input[name='"+provider_for+"']").prop("checked", false);
  }
  $('.teckstackpop-innr').removeClass('active');
  $('#'+provider_for+'-popup').addClass('active');
  $('#selection_id').val(selection_id);
  //$("input[name='"+provider_for+"']").prop("checked", false);
  $('.item').show();
  $('#teckstackpop-search').val('');
  $('#teckstackpop-other-search').val('');
  $('#teckstackpop-anlytics-search').val('');
  $('#teckstackpop-verification-search').val('');
  $('#staticBackdrop').modal('show');
  updateProviderFeature();
});


$('body').on('click','input[name="features"]',function(){
  
  var checked=$(this).prop('checked');
  
  var valudt=$(this).val();
  $('.techsummary-servicebox').each(function() {
      var textContent = $(this).text().trim();  
      if (textContent==valudt) {
        if(checked){
          $(this).removeClass('techsummaryserv-disable');
          $(this).parent().show();
        }
        else {
          $(this).addClass('techsummaryserv-disable');
          $(this).parent().hide();              
        }
        
      } 
    });
});

function updateValue(){
  
  var dtarr=[
    'current_phone_provider_select',
    'current_patient_texting_select',
    'current_reminders_recall_select',
    'current_digital_forms_select',
    'current_treatment_pre_pay_plan_select',
    'current_paytments_provider_select',
    'current_reviews_select',
    'current_online_scheduling_select',
    'current_mass_texting_select',
    'current_mass_emailing_select',
    'current_analytics_morning_huddle_select',
    'current_verification_provider_select',
];
  
  var prevsame=[];
  $('#techsummarytop_logos').html('');
  $('.readonly_pricing').removeClass('readonly_pricing');
  var logohtm="";
  var localmed_cnt=0;
  var di_cnt=0;
  var modento_cnt=0;
  dtarr.forEach(function(e){
    var valdt=$('#'+e).attr('data-value');         
    if(valdt){ 
    if(prevsame.indexOf(valdt)==-1){      
      prevsame.push(valdt);
      var price=$('#'+e).attr('data-pricing');//pricing[valdt];//$('#'+e).attr('data-pricing');
      /*if((valdt=='AT&amp;T') || (valdt=='AT&T')){
        valdt='AT_T';
        price=pricing['AT&T'];
      }*/
      
        $('#'+e).next().find('input').val(price);
    
            
      
      
        if(valdt=='DI/Modento/LocalMed'){
          if(e=='current_online_scheduling_select'){
            valdt='Localmed'; 
            localmed_cnt=1;
          }
          else if(e=='current_analytics_morning_huddle_select'){
            valdt='DI'; 
            di_cnt=1;
          }
          else{
            valdt='Modento';
            modento_cnt=1;
          }
        }
      
      
     

      if(logoimages[valdt]){
      logohtm+=`<div class="item">
        <div class="techsummarylogobox">
          `+logoimages[valdt]+`
        </div>
      </div>`;
      }
      else{
        
        logohtm+=`<div class="item">
        <div class="techsummarylogobox">
          `+valdt+`
        </div>
      </div>`;
      }
    }
    else{
      if(valdt=='DI/Modento/LocalMed'){
        if(e=='current_online_scheduling_select'){
          valdt='Localmed'; 
          if(localmed_cnt==0){
            localmed_cnt=1;
            logohtm+=`<div class="item">
              <div class="techsummarylogobox">
                `+logoimages[valdt]+`
              </div>
            </div>`;

          }
        }
        else if(e=='current_analytics_morning_huddle_select'){
          valdt='DI'; 
          if(di_cnt==0){
            di_cnt=1;
            logohtm+=`<div class="item">
              <div class="techsummarylogobox">
                `+logoimages[valdt]+`
              </div>
            </div>`;

          }
        }
        else{
          valdt='Modento';
          if(modento_cnt==0){
            modento_cnt=1;
            logohtm+=`<div class="item">
              <div class="techsummarylogobox">
                `+logoimages[valdt]+`
              </div>
            </div>`;

          }
        }

      }  
      dtarr.forEach(function(f){
        var valdto=$('#'+f).attr('data-value');
        if(valdto===valdt){
          var dtp=$('#'+f).attr('data-pricing');
          if(dtp!=""){
            $('#'+e).attr('data-pricing',dtp);
          }         
          
        }
      });       
      $('#'+e).next().find('input').val("");
      $('#'+e).next().addClass('readonly_pricing');
      
    }
  }
  });     
  $('#techsummarytop_logos').html(logohtm);
  updateTotal();
  updateFeatures();
  
}

function updateTotal(){
  
  var dtarr=[
    'current_phone_provider_price',
    'current_patient_texting_price',
    'current_reminders_recall_price',
    'current_digital_forms_price',
    'current_treatment_pre_pay_plan_price',
    'current_paytments_provider_price',
    'current_reviews_price',
    'current_online_scheduling_price',
    'current_mass_texting_price',
    'current_mass_emailing_price',
    'current_analytics_morning_huddle_price',
    'current_verification_provider_price'
];
  
  var total=0;
  dtarr.forEach(function(e){
    var valdt=$('#'+e).val();
    if(valdt){        
      total+=parseInt(valdt);
    }      
  }); 
  if($('#submit_preagreement').length>0){
    if($("#techStackCompareCheck").is(":checked")){
      /*if(total>0){
        $('#submit_preagreement').removeClass('disable-btn');  
      }
      else{
        $('#submit_preagreement').addClass('disable-btn');
      }*/
    }
  }
    $('#tech_stack_total_price').val(total);        
    $('#total_spend').text('$'+total);
  
}

function updateFeatures(){

  newFeaturesAdd();
  var newfeatures=[];
  
  //$('input[name="features"]').prop('checked', true);
  var dtarr=[
    'current_phone_provider_select',
    'current_patient_texting_select',
    'current_reminders_recall_select',
    'current_digital_forms_select',
    'current_treatment_pre_pay_plan_select',
    'current_paytments_provider_select',
    'current_reviews_select',
    'current_online_scheduling_select',
    'current_mass_texting_select',
    'current_mass_emailing_select',
    'current_analytics_morning_huddle_select',
    'current_verification_provider_select'
];
  
  dtarr.forEach(function(e){
    var valdt=$('#'+e).attr('data-value');
    if(valdt){
      if(valdt=='8x8'){
        valdt='_8x8';
      }
      else{
        valdt=valdt.split(' ').join('_');
        valdt=valdt.split('-').join('_');
        valdt=valdt.split('& ').join('_');
        valdt=valdt.split('&').join('_');
        valdt=valdt.split('/').join('_');
      }

       newfeatures = newfeatures.concat(arrfeatures[valdt]);      

    }      
  });  
  if(newfeatures.length > 0) {
    $('input[name="features"]').prop('checked', true);
    
      // Check checkboxes based on selected values
      $('input[name="features"]').filter(function() {
        return newfeatures.includes($(this).val());
      }).prop('checked', false);
      
      $('.techsummary-servicebox').each(function() {
      var textContent = $(this).text().trim();
      if (newfeatures.includes(textContent)) {
        $(this).addClass('techsummaryserv-disable');
        $(this).parent().hide();
      } else {
        $(this).removeClass('techsummaryserv-disable');
        $(this).parent().show();

      }
    });

    $('.techstack-nosummry').removeClass('active');
    $('.tabtechsummary-block').addClass('active');
  }
  else{
    $('.tabtechsummary-block').removeClass('active');
    $('.techstack-nosummry').addClass('active');
  } 
  

  
  if($('.techsummrycollps-btn').hasClass('active')){
    $('.techsummaryserv-disable').parent().show();              
  }
  else{
    $('.techsummaryserv-disable').parent().hide();
  }      
   
  
}

function updateFeaturesonload(){

  var feature_dt = $('#feature_dt').val();
  var newfeatures=[];
  if(feature_dt!=""){
    newfeatures = feature_dt.split("||");
    if(newfeatures.length > 0) {
      $('input[name="features"]').prop('checked', false);
      
        // Check checkboxes based on selected values
        $('input[name="features"]').filter(function() {
          return newfeatures.includes($(this).val());
        }).prop('checked', true);
        
        $('.techsummary-servicebox').each(function() {
        var textContent = $(this).text().trim();
        if (newfeatures.includes(textContent)) {
          $(this).removeClass('techsummaryserv-disable');
          $(this).parent().show();
        } else {
          $(this).addClass('techsummaryserv-disable');     
          $(this).parent().hide();     
        }
      });
  
      $('.techstack-nosummry').removeClass('active');
      $('.tabtechsummary-block').addClass('active');
    }
    else{
      $('.tabtechsummary-block').removeClass('active');
      $('.techstack-nosummry').addClass('active');
    }
  }

  
  if($('.techsummrycollps-btn').hasClass('active')){
    $('.techsummaryserv-disable').parent().show();              
  }
  else{
    $('.techsummaryserv-disable').parent().hide();
  }      
   
  
}

jQuery('body').on('click','#phone-provider-reset',function() {
  var selection_id=$('#selection_id').val();
  $('#'+selection_id).attr('data-pricing',"");
  $('#'+selection_id).html('Select');
  $('#'+selection_id).attr('data-value',"");
  $('#'+selection_id).next().find('input').val("");
  $("input[name='phone-provider']").prop("checked", false);
  $('#otherPhoneProvider').val('');
  $('#other-phone-provider-div').hide();
  updateValue();
});

jQuery('body').on('click','#analytics-provider-reset',function() {
  var selection_id=$('#selection_id').val();
  $('#'+selection_id).attr('data-pricing',"");
  $('#'+selection_id).html('Select');
  $('#'+selection_id).attr('data-value',"");
  $('#'+selection_id).next().find('input').val("");
  $("input[name='analytics-provider']").prop("checked", false);
  $('#otherAnalyticsProvider').val('');
  $('#other-analytics-provider-div').hide();
  updateValue();
});

jQuery('body').on('click','#other-provider-reset',function() {
  var selection_id=$('#selection_id').val();
  $('#'+selection_id).attr('data-pricing',"");
  $('#'+selection_id).html('Select');
  $('#'+selection_id).attr('data-value',"");
  $('#'+selection_id).next().find('input').val("");
  $("input[name='other-provider']").prop("checked", false);
  $('#otherOtherProvider').val('');
  $('#other-other-provider-div').hide();
  updateValue();
});

jQuery('body').on('click', '#verification-provider-reset', function () {
  var selection_id = $('#selection_id').val();
  $('#' + selection_id).attr('data-pricing', "");
  $('#' + selection_id).html('Select');
  $('#' + selection_id).attr('data-value', "");
  $('#' + selection_id).next().find('input').val("");
  $("input[name='verification-provider']").prop("checked", false);
  $('#otherVerificationProvider').val('');
  $('#other-verification-provider-div').hide();
  updateValue();
});

jQuery('body').on('click','#phone-provider-submit',function() {
  var selection_id=$('#selection_id').val();      
  var selectedRadioButton = $("input[name='phone-provider']:checked");
  var imgatr=selectedRadioButton.next().html();
  var select_provider = selectedRadioButton.val();
  
  if(imgatr=='Other'){
    var otherPhoneProvider=$('#otherPhoneProvider').val();       
    if(otherPhoneProvider==""){
      $('#otherPhoneProvider').addClass('require');
      return false;
    }
    else{
      $('#otherPhoneProvider').removeClass('require');
      imgatr="Other: "+otherPhoneProvider;
    }
  }
  var preval=$('#'+selection_id).attr('data-value');
  
  $('#'+selection_id).html(imgatr);
  $('#'+selection_id).attr('data-value',imgatr);
  if(pricing.hasOwnProperty(select_provider)){
    $('#'+selection_id).attr('data-pricing',pricing[select_provider]);
  }
  else{
    $('#'+selection_id).attr('data-pricing',"");
  }

  //$('#'+selection_id).addClass('techimg-selected');      
  //$('#phone-provider-price').val(pricing[select_provider]);
  updateValue();
  $('#staticBackdrop').modal('hide');
});

jQuery('body').on('click','#analytics-provider-submit',function() {
  var selection_id=$('#selection_id').val();      
  var selectedRadioButton = $("input[name='analytics-provider']:checked");
  var imgatr=selectedRadioButton.next().html();
  var select_provider = selectedRadioButton.val();
  if(imgatr=='Other'){
    var otherAnalyticsProvider=$('#otherAnalyticsProvider').val();       
    if(otherAnalyticsProvider==""){
      $('#otherAnalyticsProvider').addClass('require');
      return false;
    }
    else{
      $('#otherAnalyticsProvider').removeClass('require');
      imgatr="Other: "+otherAnalyticsProvider;
    }
  }
  $('#'+selection_id).html(imgatr);
  $('#'+selection_id).attr('data-value',imgatr);
  
  if(pricing.hasOwnProperty(select_provider)){
    $('#'+selection_id).attr('data-pricing',pricing[select_provider]);
  }
  else{
    $('#'+selection_id).attr('data-pricing',"");
  }
  
  //$('#'+selection_id).addClass('techimg-selected');
  updateValue();
  $('#staticBackdrop').modal('hide');
});

jQuery('body').on('click','#other-provider-submit',function() {
  var selection_id=$('#selection_id').val();      
  var selectedRadioButton = $("input[name='other-provider']:checked");
  var imgatr=selectedRadioButton.next().html();
  var select_provider = selectedRadioButton.val();
  if(imgatr=='Other'){
    var otherOtherProvider=$('#otherOtherProvider').val();       
    if(otherOtherProvider==""){
      $('#otherOtherProvider').addClass('require');
      return false;
    }
    else{
      $('#otherOtherProvider').removeClass('require');
      imgatr="Other: "+otherOtherProvider;
    }
  }
  $('#'+selection_id).html(imgatr);
  $('#'+selection_id).attr('data-value',imgatr);
  if(pricing.hasOwnProperty(select_provider)){
    $('#'+selection_id).attr('data-pricing',pricing[select_provider]);
  }
  else{
    $('#'+selection_id).attr('data-pricing',"");
  }
  //$('#'+selection_id).addClass('techimg-selected');       
  updateValue();
  $('#staticBackdrop').modal('hide');
});

jQuery('body').on('click', '#verification-provider-submit', function () {
  var selection_id = $('#selection_id').val();
  var selectedRadioButton = $("input[name='verification-provider']:checked");
  var imgatr = selectedRadioButton.next().html();
  var select_provider = selectedRadioButton.val();
  var data_value = '';
  if (imgatr == 'Other') {
      var otherVerificationProvider = $('#otherVerificationProvider').val();
      if (otherVerificationProvider == "") {
          $('#otherVerificationProvider').addClass('require');
          return false;
      }
      else {
          $('#otherVerificationProvider').removeClass('require');
          imgatr = "Other: " + otherVerificationProvider;
      }
      data_value = imgatr;
  } else {
    data_value = select_provider;
  }
  var preval = $('#' + selection_id).attr('data-value');

  $('#' + selection_id).html(imgatr);
  $('#' + selection_id).attr('data-value', data_value);
  if (pricing.hasOwnProperty(select_provider)) {
      $('#' + selection_id).attr('data-pricing', pricing[select_provider]);
  }
  else {
      $('#' + selection_id).attr('data-pricing', "");
  }

  //$('#'+selection_id).addClass('techimg-selected');
  //$('#phone-provider-price').val(pricing[select_provider]);
  updateValue();
  $('#staticBackdrop').modal('hide');
});

jQuery('body').on('click','.techsummryexpnd-btn',function() {
  $(this).removeClass('active');
  $('.techsummaryserv-disable').parent().show();
  $('.techsummrycollps-btn').addClass('active');
});

jQuery('body').on('click','.techsummrycollps-btn',function() {
  $(this).removeClass('active');
  $('.techsummaryserv-disable').parent().hide();
  $('.techsummryexpnd-btn').addClass('active');
});

jQuery('body').on('click','.phone-provider-cls',function() {
  if($("input[name='phone-provider']:checked").val()=='Other'){
    $('#other-phone-provider-div').show();
    $('#phone-provider-submit').show();
  }
  else{
    $('#phone-provider-submit').hide();
    $('#other-phone-provider-div').hide();
    $('#phone-provider-submit').trigger('click');
  }
  
});

jQuery('body').on('click','.analytics-provider-cls',function() {
  if($("input[name='analytics-provider']:checked").val()=='Other'){
    $('#other-analytics-provider-div').show();
    $('#analytics-provider-submit').show();
  }
  else{
    $('#analytics-provider-submit').hide();
    $('#other-analytics-provider-div').hide();
    $('#analytics-provider-submit').trigger('click');
  }
  
});

jQuery('body').on('click','.other-provider-cls',function() {
  if($("input[name='other-provider']:checked").val()=='Other'){
    $('#other-other-provider-div').show();
    $('#other-provider-submit').show();
  }
  else{
    $('#other-provider-submit').hide();
    $('#other-other-provider-div').hide();
    $('#other-provider-submit').trigger('click');
  }
  
});

jQuery('body').on('click', '.verification-provider-cls', function () {
  if ($("input[name='verification-provider']:checked").val() == 'Other') {
      $('#other-verification-provider-div').show();
      $('#verification-provider-submit').show();
  }
  else {
      $('#verification-provider-submit').hide();
      $('#other-verification-provider-div').hide();
      $('#verification-provider-submit').trigger('click');
  }
});


 

jQuery('body').on('click','#tech_stack_info_submit',function() {
  saveTechStackData();
});

function saveTechStackData(){
  $('.require').removeClass('require');
var errrhmfrm="false";

var current_phone_provider_select = $('#current_phone_provider_select').attr('data-value');
var current_patient_texting_select = $('#current_patient_texting_select').attr('data-value');
var current_reminders_recall_select = $('#current_reminders_recall_select').attr('data-value');
var current_digital_forms_select = $('#current_digital_forms_select').attr('data-value');
var current_treatment_pre_pay_plan_select = $('#current_treatment_pre_pay_plan_select').attr('data-value');
var current_paytments_provider_select = $('#current_paytments_provider_select').attr('data-value');
var current_reviews_select = $('#current_reviews_select').attr('data-value');
var current_online_scheduling_select = $('#current_online_scheduling_select').attr('data-value');
var current_mass_texting_select = $('#current_mass_texting_select').attr('data-value');
var current_mass_emailing_select = $('#current_mass_emailing_select').attr('data-value');
var current_analytics_morning_huddle_select = $('#current_analytics_morning_huddle_select').attr('data-value');
var current_verification_provider_select = $('#current_verification_provider_select').attr('data-value');
var current_phone_provider_price = $('#current_phone_provider_price').val();
var current_patient_texting_price = $('#current_patient_texting_price').val();
var current_reminders_recall_price = $('#current_reminders_recall_price').val();
var current_digital_forms_price = $('#current_digital_forms_price').val();
var current_treatment_pre_pay_plan_price = $('#current_treatment_pre_pay_plan_price').val();
var current_paytments_provider_price = $('#current_paytments_provider_price').val();
var current_reviews_price = $('#current_reviews_price').val();
var current_online_scheduling_price = $('#current_online_scheduling_price').val();
var current_mass_texting_price = $('#current_mass_texting_price').val();
var current_mass_emailing_price = $('#current_mass_emailing_price').val();
var current_analytics_morning_huddle_price = $('#current_analytics_morning_huddle_price').val();
var current_verification_provider_price = $('#current_verification_provider_price').val();
var tech_stack_total_price = $('#tech_stack_total_price').val();
var agreement_id= $('#agreement_id').val();
var features=[];
$('input[name="features"]:checked').each(function() {
      features.push($(this).val());
    });


$('.loader').show();
var datafottfrm={
    '_token' : $('meta[name="csrf-token"]').attr('content'),
    'agreement_id' : agreement_id,
    'current_phone_provider_select' : current_phone_provider_select,
    'current_patient_texting_select' : current_patient_texting_select, 
    'current_reminders_recall_select':current_reminders_recall_select,
    'current_digital_forms_select' :current_digital_forms_select,
    'current_treatment_pre_pay_plan_select' :current_treatment_pre_pay_plan_select,
    'current_paytments_provider_select' :current_paytments_provider_select,
    'current_reviews_select' :current_reviews_select,
    'current_online_scheduling_select' :current_online_scheduling_select,
    'current_mass_texting_select' :current_mass_texting_select,
    'current_mass_emailing_select' :current_mass_emailing_select,
    'current_analytics_morning_huddle_select' :current_analytics_morning_huddle_select,
    'current_verification_provider_select': current_verification_provider_select,
    'current_phone_provider_price' :current_phone_provider_price,
    'current_patient_texting_price' :current_patient_texting_price,
    'current_reminders_recall_price' :current_reminders_recall_price,
    'current_digital_forms_price' :current_digital_forms_price,
    'current_treatment_pre_pay_plan_price' :current_treatment_pre_pay_plan_price,
    'current_paytments_provider_price' :current_paytments_provider_price,
    'current_reviews_price' :current_reviews_price,
    'current_online_scheduling_price' :current_online_scheduling_price,
    'current_mass_texting_price' :current_mass_texting_price,
    'current_mass_emailing_price' :current_mass_emailing_price,
    'current_analytics_morning_huddle_price' :current_analytics_morning_huddle_price,
    'current_verification_provider_price': current_verification_provider_price,
    'tech_stack_total_price' :tech_stack_total_price,    
    'features' :features,
};

jQuery.ajax({
       type:'POST',
       url:'/add-tech-stack',
       data:datafottfrm,
       success:function(response) {
        if($.isEmptyObject(response.error)){
        arr = response.split("||*||");
        if (arr[1] === 'fail') {
          jQuery(".loader").hide();
          return false;
        }
        else{                  
          //jQuery(".loader").hide();
          window.location.href='/agreement/'+agreement_id;
          return false;
        }

        }else{
            var msg=response.error;
            $.each( msg, function( key, value ) {
                jQuery("#"+value).addClass('require');
            });
            return false;
        }
       }
    });
}

$(document).ready(function(){
  updateValue();
  updateTotal();
  setTimeout(function(){updateFeaturesonload();},100);
  
  hideShowOption();

});

function updateProviderFeature(){
  var practice_industry = jQuery('#practice_industry').val();
  //var phone_provider = ['Kasper','Mango','Peer Logic','Revenue Well'];
  if(practice_industry=='Optometry'){
      /*phone_provider = ['Weave','Aloha','GoTo Connect','RingCentral','Verizon','AT&T','Comcast','xFinity','Other'];
      var phone_prov_feat = jQuery('.phone-provider-cls');
      phone_prov_feat.hide()
      phone_prov_feat.each(function(i, el) {
          if (phone_provider.includes($(el).attr('value'))) {
              $(el).parents('div.item').fadeOut("fast");
          } else {
              $(el).parents('div.item').fadeIn();
          }
      });

      var other_provider = ['Birdeye','Cooper Vision','Demand Force','Doctible','Legwork','Podium','Solution Reach','Swell','Weave','ZocDoc','4 Patient Care','Other'];
      var other_prov_feat = jQuery('.other-provider-cls');
      other_prov_feat.hide()
      other_prov_feat.each(function(i, el) {
          if (other_provider.includes($(el).attr('value'))) {
              $(el).parents('div.item').fadeIn();
          } else {
              $(el).parents('div.item').fadeOut("fast");
          }
      });

      var analytics_provider = ['ABB Analyze','Other','PMS/EHR'];
      var analytics_prov_feat = jQuery('.analytics-provider-cls');
      analytics_prov_feat.hide()
      analytics_prov_feat.each(function(i, el) {
          if (analytics_provider.includes($(el).attr('value'))) {
              $(el).parents('div.item').fadeIn();
          } else {
              $(el).parents('div.item').fadeOut("fast");
          }
      });*/
      jQuery('.phone-provider-cls').parents('div.item').hide();
      jQuery('.other-provider-cls').parents('div.item').hide();
      jQuery('.analytics-provider-cls').parents('div.item').hide();
      jQuery('.phone-provider-cls.opto').parents('div.item').fadeIn();
      jQuery('.other-provider-cls.opto').parents('div.item').fadeIn();
      jQuery('.analytics-provider-cls.opto').parents('div.item').fadeIn();

  } else {
    jQuery('.phone-provider-cls').parents('div.item').hide();
    jQuery('.other-provider-cls').parents('div.item').hide();
    jQuery('.analytics-provider-cls').parents('div.item').hide();
    jQuery('.phone-provider-cls.dental').parents('div.item').fadeIn();
    jQuery('.other-provider-cls.dental').parents('div.item').fadeIn();
    jQuery('.analytics-provider-cls.dental').parents('div.item').fadeIn();
  }
}

jQuery('body').on('change', '#practice_industry', function () {
  var practice_industry = jQuery(this).attr('value');
  jQuery('#practice_ehr').val('').trigger('change');
  jQuery('#sales_person_promotion_type').val('Custom').trigger('change');
  hideShowOption();
  var dtarr=[
    'current_phone_provider_select',
    'current_patient_texting_select',
    'current_reminders_recall_select',
    'current_digital_forms_select',
    'current_treatment_pre_pay_plan_select',
    'current_paytments_provider_select',
    'current_reviews_select',
    'current_online_scheduling_select',
    'current_mass_texting_select',
    'current_mass_emailing_select',
    'current_analytics_morning_huddle_select',
    'current_verification_provider_select'
  ];
  dtarr.forEach(function(select_provider){
    $('#'+select_provider).attr('data-pricing',"");
    $('#'+select_provider).html('Select');
    $('#'+select_provider).attr('data-value',"");
    $('#'+select_provider).next().find('input').val("");
    $("input[name='phone-provider']").prop("checked", false);
    updateValue();
  });

  showhidepricing();
});

function newFeaturesAdd(){
  var practice_industry = jQuery('#practice_industry').val();
  if(practice_industry=='Optometry'){
      if ($.inArray('Eyewear Ready',arrfeatures['Demand_Force'])==-1) {
           arrfeatures['Demand_Force'].push('Eyewear Ready');
      }
      if ($.inArray('Eyewear Ready',arrfeatures['Solution_Reach'])==-1) {
          arrfeatures['Solution_Reach'].push('Eyewear Ready');
      }
      if ($.inArray('Eyewear Ready',arrfeatures['Weave'])==-1) {
          arrfeatures['Weave'].push('Eyewear Ready');
      }

      if (arrfeatures['Birdeye'].includes('Appt Reminders')) {
          arrfeatures['Birdeye'].splice(arrfeatures['Birdeye'].indexOf("Appt Reminders"), 1);
      }
      if (arrfeatures['Birdeye'].includes('Real-Time Online Scheduling')) {
          arrfeatures['Birdeye'].splice(arrfeatures['Birdeye'].indexOf("Real-Time Online Scheduling"), 1);
      }
  } else {
      if (arrfeatures['Demand_Force'].includes('Eyewear Ready')) {
          arrfeatures['Demand_Force'].splice(arrfeatures['Demand_Force'].indexOf('Eyewear Ready'), 1);
      }
      if (arrfeatures['Solution_Reach'].includes('Eyewear Ready')) {
          arrfeatures['Solution_Reach'].splice(arrfeatures['Solution_Reach'].indexOf('Eyewear Ready'), 1);
      }
      if (arrfeatures['Weave'].includes('Eyewear Ready')) {
          arrfeatures['Weave'].splice(arrfeatures['Weave'].indexOf('Eyewear Ready'), 1);
      }

      if ($.inArray('Appt Reminders',arrfeatures['Birdeye'])==-1) {
          arrfeatures['Birdeye'].push('Appt Reminders');
      }
      if ($.inArray('Real-Time Online Scheduling',arrfeatures['Birdeye'])==-1) {
          arrfeatures['Birdeye'].push('Real-Time Online Scheduling');
      }
  }
}

function hideShowOption(){
  var practice_industry = jQuery('#practice_industry').val();
  if(practice_industry=='Optometry'){
    jQuery('.verification_provider_div').addClass('d-none');
    jQuery('.verification_teckstack').addClass('d-none');
    jQuery('.verification_techsummary').addClass('d-none');
    jQuery('.teckstack-gapservices.verification_teckstack').find('.form-check-input').each(function(e) {
        jQuery(this).prop('checked',false);
    });

    var promotion_arr=[
      'Smile Source',
      'TruBlu',
      'DDSOM',
      'AIDA Member'];
    promotion_arr.forEach(function(type){
      $('#sales_person_promotion_type').find('option:contains('+type+')').hide(); 
    });

    jQuery('.opto-pms-ehr').show();
    jQuery('.dental-pms-ehr').hide();
  } else {
      jQuery('.verification_provider_div').removeClass('d-none');
      jQuery('.verification_teckstack').removeClass('d-none');
      jQuery('.verification_techsummary').removeClass('d-none');
      jQuery('.teckstack-gapservices.verification_teckstack').find('.form-check-input').each(function(e) {
          jQuery(this).prop('checked',true);
      });
      $("#sales_person_promotion_type").children('option').show();
      jQuery('.opto-pms-ehr').hide();
      jQuery('.dental-pms-ehr').show();
  }
}