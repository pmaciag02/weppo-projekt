# Weppo projekt

## Patryk Maciąg, Stanisław Reda

**Sklep internetowy**

Klasyczna witryna w node.js + Express, która realizuje funkcjonalność sklepu intenetowego. Aplikacja składa się z wielu widoków dla użytkowników, dane przechowywane są w relacyjnej bazie danych PostreSQL.


## Wymagania funkcjonalne:
- Użytkownik anonimowy (bez logowania)
    - przeglądanie zawartości sklepu (towary)
    - proste wyszukiwanie po nazwie/opisie towaru

- Użytkownik posiadający konto
    - utworzenie nowego konta (podanie loginu/hasła)
    - możliwość zalogowania się
    - w trakcie przeglądania zawartości - możliwość dodania towaru do koszyka
    - podsumowanie zamówienia z koszyka

- Administrator
    - dodawanie/modyfikacja/usuwanie towarów w sklepie
    - przeglądanie listy użytkowników
    - przeglądanie listy złożonych/otwartych zamówień
