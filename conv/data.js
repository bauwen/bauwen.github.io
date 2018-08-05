var conversionData = {
    
    "temperature": {
    
        "symbols": {
            "kelvin":     "K",
            "celsius":    "°C",
            "fahrenheit": "°F",
        },
    
        "conversions": {
            "kelvin -> celsius":    "x - 273.15",
            "kelvin -> fahrenheit": "x * 9 / 5 - 459.67",
        }
        
    },
    
    "length": {
    
        "symbols": {
            "meter":      "m",
            "light-year": "ly",
            "kilometer":  "km",
            "decimeter":  "dm",
            "centimeter": "cm",
            "millimeter": "mm",
            
            "yard": "yd",
            "mile": "mi",
            "feet": "ft",
            "inch": "in",
        }
    
        "conversions": {
            "meter -> light-year": "x / 9460730472580800",
            "meter -> kilometer":  "x / 1000",
            "meter -> decimeter":  "x * 10",
            "meter -> centimeter": "x * 100",
            "meter -> millimeter": "x * 1000",
            
            "yard -> mile": "x / 1760"
            "yard -> foot": "x * 3",
            "yard -> inch": "x * 36",
            
            "yard -> meter": "x * 0.9144",
        }
        
    },
    
    "mass": {
    
        "symbols": {
            "kilogram": "kg",
            "tonne":    "t",
            "gram":     "g",
            
            "pound": "lb",
        },
    
        "conversions": {
            "kilogram -> tonne": "x / 1000",
            "kilogram -> gram":  "x * 1000",
            
            "pound -> kilogram": "x * 0.45359237",
        }
        
    },
    
    // TODO: add more unit types (e.g. electricity, speed, force, currency ...)
    
};
