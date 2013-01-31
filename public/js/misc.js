

var confirmarSubmit = function(msg,form) {

   if (confirm(msg)) {
      form.submit();
   }
   return false;
}


