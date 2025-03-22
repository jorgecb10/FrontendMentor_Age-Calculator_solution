document.addEventListener('DOMContentLoaded', () => {
    console.log('document loaded')

    const inputDay = document.getElementById('day')
    const inputMonth = document.getElementById('month')
    const inputYear = document.getElementById('year')
    const btnSubmit = document.getElementById('btn')
    const paragraphDays = document.getElementById('pDays')
    const paragraphMonths = document.getElementById('pMonths')
    const paragraphYears = document.getElementById('pYears')
    const inputs = [inputDay, inputMonth, inputYear]

    inputs.forEach(input => {
        input.addEventListener('input', e => {
            if (input.value.trim() !== '') {
                eliminarAlerta(input)
                validarDatos(e)
            } else if (input.value.trim() === '') {
                mostrarAlerta(input, 'This field is required')
            }
        })
    })
    
    btnSubmit.addEventListener('click', () => {
        if(validarInputs()) {
            inputs.forEach(input => eliminarAlerta(input))
            calcularEdad()
        } else {
            inputs.forEach(input => {
                if (input.value === '') {
                    mostrarAlerta(input, 'This field is required')
                }
            })
        }
    })

    function calcularEdad() {
        const day = parseInt(inputDay.value)
        const month = parseInt(inputMonth.value) - 1
        const year = parseInt(inputYear.value)

        const birthDate = dayjs(new Date(year, month, day))
        const currentDate = dayjs()

        if (!birthDate.isValid() || birthDate > currentDate) {
            mostrarAlerta(inputDay, 'Invalid date')
            return
        }

        const ageYears = currentDate.diff(birthDate, 'year')
        const ageMonths = currentDate.diff(birthDate.add(ageYears, 'year'), 'month')
        const ageDays = currentDate.diff(birthDate.add(ageYears, 'year').add(ageMonths, 'month'), 'day')

        mostrarResultados(ageYears, ageMonths, ageDays)
    }

    function mostrarResultados(years, months, days) {
        paragraphYears.textContent = years
        paragraphMonths.textContent = months
        paragraphDays.textContent = days
    }

    function validarDatos(e) {
        const valor = e.target.value.trim()
        let id = e.target.id

        let maxLength = 2
        if(id === 'year') {
            maxLength = 4
        }

        e.target.value = valor.replace(/\D/g, '').slice(0, maxLength)
    }

    function validarInputs() {
        let isValid = true
        const currentYear = dayjs().year()

        inputs.forEach(input => {
            const valor = input.value
            const id = input.id
            
            if (valor === '') {
                mostrarAlerta(input, 'This field is required')
                isValid = false
            } else if (id === 'day' && (valor < 1 || valor > 31)) {
                mostrarAlerta(input, 'Must be a valid day')
                isValid = false
            } else if (id === 'month' && (valor < 1 || valor > 12)) {
                mostrarAlerta(input, 'Must be a valid month')
                isValid = false
            } else if (id === 'year' && (valor > currentYear)) {
                mostrarAlerta(input, 'Must be in the past')
                isValid = false
            } else if (id === 'day') {
                const dia = parseInt(inputDay.value)
                const mes = parseInt(inputMonth.value)
                const anio = parseInt(inputYear.value)

                // Verificar si la fecha es válida para el mes dado
                if (!esFechaValida(dia, mes, anio)) {
                    mostrarAlerta(inputDay, 'Invalid day for the selected month')
                    isValid = false
                }
            }
        })
        return isValid
    }

    function esFechaValida(dia, mes, anio) {
        const diasEnMes = [31, (esBisiesto(anio) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
        return dia <= diasEnMes[mes - 1]  // Restamos 1 al mes porque está indexado desde 0
    }

    // Verifica si el año es bisiesto
    function esBisiesto(anio) {
        return (anio % 4 === 0 && anio % 100 !== 0) || (anio % 400 === 0)
    }

    function mostrarAlerta(input, mensaje) {
        eliminarAlerta(input)

        const label = input.previousElementSibling

        const alerta = document.createElement('P')
        alerta.classList.add('error', 'font-poppins-italic', 'text-[10px]', 'text-light-red')
        alerta.textContent = mensaje
        input.classList.remove('border-light-grey')
        input.classList.add('border-light-red')
        label.classList.remove('text-smokey-grey')
        label.classList.add('text-light-red')
        input.insertAdjacentElement('afterend', alerta)
    }

    function eliminarAlerta(input) {
        const alerta = input.nextElementSibling
        if (alerta) {
            input.classList.remove('border-light-red')
            input.classList.add('border-light-grey')
            input.previousElementSibling.classList.remove('text-light-red')
            input.previousElementSibling.classList.add('text-smokey-grey')
            alerta.remove()
        }
    }
})