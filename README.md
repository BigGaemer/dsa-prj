# dsa-prj

to run: have nodejs and npm installed (should come from the same package)
run (in terminal) `npm i`
run (in terminal) `npm start`

## Project Description: 
Our project is about an mobile phonebook aplication that allows users to manage a list of contacts using simple data structures such as:
<br> Arrays and Linked Lists.
<br><br>
Our project has the ability to:
<br> Insert contacts, search for contacts, display contacts, update contacts, delete contacts and sort contacts.
<br> It also includes a simple user-friendly interface for managing contacts.

## Modules and Descriptions:
INSERT CONTACT
<br> Purpose: Adds a new conntact into the phonebook.
<br> Process: Promts the user to input a contacts name and number.
<br> It then checks if the contact list is empty, if it is, it sets the head to the new node.
<br> If the list isnt empty, it traverses the list to the end and inserts a new node as the last element.

<br> SEARCH CONTACT
<br> Purpose: Searches for a contact using their name.
<br> Process: Prompts the user to enter the name of the contact that they are looking for.
<br> It loops through the contact list and compares each contacts name with the given input. 
<br> If the name matches, it displays the contacts name and phone number, and marks it as found.
<br> If there is no match by the end of the loop it displays "Contact not found".

<br> DISPLAY ALL CONTACTS
<br> Purpose: Displays all current contacts in the phonebook.
<br> Process: Checks if the contact list is empty.
<br> If the list is not empty, it loops through the array and prints each contacts name and phone number.

<br> UPDATE CONTACTS
<br> Purpose: Allows the updating of an existing contacts name or phone number.
<br> Process: Calls the searchContact function to find the contact by name.
<br> If the contact is found, it updates updates both the contacts name and phone number.
<br> If the contact is not found it displays "Contact not found".

<br> DELETE CONTACT
<br> Purspose: Allows the user to remove a contact from the phonebook.
<br> Process: Checks if the contact list is empty.
<br> Checks if the contact that needs to be deleted is the first in the list.
<br> Otherwise it traverses the contact list to find the correct contact.
<br> The contact is deleted.
<br> If the contact is not found it prints "Contact not found.

<br> SORTING CONTACTS
<br> Purpose: Aloows you to sort contacts alphabetically by their name
<br> Process: Checks if the contact list is empty.
<br> It then performs a bubble sort on the contacts by swapping adjacent nodes in the list it they are out of order.
<br> It continues this process until the list is fully sorted, indicated by there being no more swaps that occur dueing a full pass.
