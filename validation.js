// slider 
const $ = document.querySelector.bind(document);

const containner = $('.container')
const signUpBtn = $('.green-btn button')

signUpBtn.addEventListener('click', () => {
   containner.classList.toggle('change')
})

// validate đối tượng
function Validator(options) {

    const selectorRules = {}
    // thực hiện validate
    function validate(inputElement,rule) {
        const errorElement = inputElement.parentElement.querySelector(options.errorSelector)
        // const errorMes =  rule.test(inputElement.value)
        var errorMes  
        // lấy ra các rule của selector và kiểm tra ghi đè rule
        var rules = selectorRules[rule.selector]
        for(let i of rules) {
            errorMes = i(inputElement.value)
            if(errorMes) {break}
        }
        // thực hiện validate
        if(errorMes) {
             errorElement.innerText = errorMes;
             inputElement.parentElement.classList.add('invalid')
             inputElement.parentElement.querySelector('input').style.border = "none"
        }
        else {
         errorElement.innerText = ''
         inputElement.parentElement.classList.remove('invalid')

        }
        return  ! errorMes
    }
    // lấy element của form
    var formElement = $(options.form)
    if (formElement) {


        // thưc hiện lặp qua từng rule và validate
        formElement.onsubmit = function(e) {
            e.preventDefault()
            var isFormValid = true;

            options.rules.forEach((rule) => {
                var inputElement = formElement.querySelector(rule.selector)
                let isValid = validate(inputElement, rule)
                if(!isValid) {
                    isFormValid = false
                }
            })
            if(isFormValid) {
                // submit voi js
                if(typeof options.onSubmit === 'function'){

                    var formEnableInput = formElement.querySelectorAll('[name]:not([disabled])') 
                    console.log(formEnableInput)// disabled la k tuong tac duoc
                    var formValues = Array.from(formEnableInput).reduce((values, currInput) =>{
                       
                        return (values[currInput.name] = currInput.value) && values;
                    },{})
                    options.onSubmit(formValues)
                }
                // submit mac dinh
                else {
                    formElement.submit();
                }
            }
            
               
        }

        options.rules.forEach((rule) => {

            // xử lý tránh ghi đè rule
            if(Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test)
            }else {
                selectorRules[rule.selector] = [rule.test]
            }


            var inputElement = formElement.querySelector(rule.selector)
            if(inputElement){
                // xử lý trường hợp blur khỏi inpput
                inputElement.onblur = () => {
                    validate(inputElement, rule)
                }

                // xử lý khi người dùng nhập vào

                inputElement.oninput  = () => {
                    const errorElement = inputElement.parentElement.querySelector(options.errorSelector)
                    errorElement.innerText = ''
                    inputElement.parentElement.classList.remove('invalid')
                }
            }
        })
    }

}


// định nghĩa các rules
Validator.isRequired = function(selector) {
    return {
        selector,
        test: function(value) {
            return value.trim() ? undefined : 'vui lòng nhập vào trường này'

        }
    }
}

Validator.isEmail = function(selector)  {
    return {
        selector,
        test: function(value) {
            const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : 'vui lòng nhập đúng email'
        }
    }
}

Validator.minLength = function(selector ,min)  {
    return {
        selector,
        test: function(value) {
            return value.length >= min ? undefined : `vui lòng nhập tối thiểu ${min} kí tự `
        }
    }
}
Validator.isConfigPassword = function(selector , getPassword)   {
    return {
        selector,
        test: function(value) {
            return value == getPassword() ? undefined : `Giá trị nhập vào không hợp lệ`
        }
    }
}



