import { useState, useEffect, useMemo } from "react"
import { db } from "../data/db"

const useCart = () => {
    
    const initialCart = () => {
        const localStorageCart = localStorage.getItem('cart')
        return localStorageCart ? JSON.parse(localStorageCart) : []
        //busca primero si localstorage tiene algo, entonces setea ese valor, sino, su valor inicial sera un array vacio
    }

    const [data] = useState(db)
    const [cart, setCart] = useState(initialCart)  //para el carrito
    const MAX_ITEMS = 5;
    const MIN_ITEMS = 1;

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart)) // API que almacena strings y con json lo transformamos a string
    }, [cart]) //cada vez que cart cambie, ejecuta ese codigo

    function addToCart(item){

        const itemExist = cart.findIndex(guitar => guitar.id === item.id)
        if(itemExist >=0) { // existe en el carrito
            if(cart[itemExist].quantity >= MAX_ITEMS) return
            const updateCart = [...cart]; //para que cambie la cantidad de guitarras
            updateCart[itemExist].quantity++;
            setCart(updateCart);
        }else {
            item.quantity = 1;
            setCart([...cart, item]);
        } 
    }

    function removeCart(id){
        setCart(prevCart => prevCart.filter(guitar => guitar.id !== id))
    }

    function increaseQuantity(id){
        const updateCart = cart.map(item => {
            if(item.id === id && item.quantity < MAX_ITEMS) {
                return {
                    ...item,
                    quantity: item.quantity + 1
                }
            }
            return item
        })
        setCart(updateCart)
    }

    function decreaseQuantity(id){
        const updateCart = cart.map( item => {
            if(item.id === id && item.quantity > MIN_ITEMS) {
                return {
                    ...item,
                    quantity: item.quantity - 1
                }
            }
            return item
        })
        setCart(updateCart)
    }

    function clearCard(e){
        setCart([]) //reiniciar con un array vacio
    }

      //state derivado
  const isEmpty = useMemo( () => cart.length === 0, [cart]) //vuele hacer el renderizado cuando carrito cambie
  const cartTotal = useMemo( () => cart.reduce((total, item) => total + (item.quantity * item.price), 0), [cart])
   //item es el elemento actual ** el total se calcula cada vez que carrito cambie
  
  //console.log(cartTotal)

    return{
        data,
        cart,
        addToCart,
        removeCart,
        decreaseQuantity,
        increaseQuantity,
        clearCard, 
        isEmpty,
        cartTotal
    }
}

export default useCart