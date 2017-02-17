#include <iostream>
#include <vector>
#include <cstdlib>

void printBoard(std::vector<bool> elementVector, int lineLength, char trueChar, char falseChar);
// Prints a vector (elementVector) to the console, starting with the first element and
// beginning a new line when the number of elements on the current line reaches a specified
// quantity (lineLength)
// Pre-conditions: elementVector - a vector of booleans (any length)
//                 lineLength - an int that is greater than 0
//                 trueChar - a character that will be printed to represent a true value
//                            in elementVector
//                 falseChar - a character that will be printed to represent a false value
//                             in elementVector
// Post-conditions: This function will output, beginning on a new line, a sequence of 
//                  characters to the console with lineLength characters per line.

std::vector<bool> randomBooleanVector(int length);
// Generates a vector of boolean values, which are randomly chosen, of size length.
// Pre-conditions: length - an int specifying the number of elements that should be
//                          contained in the vector to be output
// Returns: Vector of size == length, containing randomly distributed boolean values


bool getNextState (std::vector<bool> currentElementVector, int lineLength, int elementIndex);
// Returns the upcoming state of the element at 'elementIndex' by using Conway's rules:
//     1. Any living element with fewer than 2 living neighboring elements dies
//     2. Any living element with 2 - 3 living neighboring elements lives
//     3. Any living element more than 3 living neighboring elements dies
//     4. Any dead element with EXACTLY 3 living neighboring elements comes to life


int main ()
{
    using namespace std;

    vector<bool> testVector1 = {1, 1, 1, 1, 0, 0, 0, 0};
    printBoard (testVector1, 4, 'X', 'O');
    printBoard (testVector1, 4, 'X', ' ');

    vector<bool> testVector2 = randomBooleanVector (100);
    printBoard (testVector2, 10, 'X', 'O');

    int length;
    cout << "Enter the length of your vector: ";
    cin >> length;

    int lineLength;
    cout << "Enter the length of each line: ";
    cin >> lineLength;

    vector<bool> testVector3 = randomBooleanVector (length);
    printBoard (testVector3, lineLength, 'X', 'O');

    return 0;
}


void printBoard (std::vector<bool> elementVector, int lineLength, char trueChar, char falseChar)
{
    // Start a new line
    // For each element in the vector
    //     Create a variable to count the number of characters on current line
    //     If the number of characters on current line is >= lineLength
    //     	Start a new line
    //     	Reset the count of characters on current line
    //     Output the current character
    //     Increment the count of characters on the current line
    // Start a new line (so that console's prompt does not append to end of output
    using namespace std;

    cout << endl;
    for (int i = 0, charCount = 0; i < elementVector.size(); ++i)
    {
        if (charCount >= lineLength)
	{
	    cout << endl;
	    charCount = 0;
	}

	switch (elementVector[i])
	{
	    case true:
	        cout << trueChar;
		break;
	    case false:
		cout << falseChar;
		break;
	    default:
		cout << '?';
	}
	++charCount;
    }
    cout << endl;
}


std::vector<bool> randomBooleanVector(int length)
{
    // Declare a new vector of size == length
    // for each element in the vector
    //     Get a random value from 0 to 99
    //     If random value > 50
    //         Set current element = true
    //     Else
    //         Set current element = false
    // Return the vector
    using namespace std;

    vector<bool> randomVector (length, false);
    for (int i = 0; i < length; ++i)
    {
        int randomValue = rand() % 100;
        if (randomValue >= 50)
	    randomVector[i] = true;
    }
    return randomVector;
}


bool getNextState (std::vector<bool> currentElementVector, int lineLength, int elementIndex)
{
    // Determine indices of neighboring cells
    // Get the states of neighboring cells
    //
    // 0   1   2   3   4    |  0   1   2   3   4
    // 5   6   7   8   9    | n-7 n-6 n-5 n-4 n-3
    // 10  11  n   13  14   | n-2 n-1  n  n+1 n+2
    // 15  16  17  18  19   | n+3 n+4 n+5 n+6 n+7
    // 20  21  22  23  24   |  20  21  22  23  24
    //
    //
    // Case 1: current element is first in row
    // Case 2: current element is last in row
    // Case 3: current element is neither first nor last in row
    // 
    // If Case 1
    //     NW, W, SW  -->  should all be considered dead
    // If Case 2
    //     NE, E, SE  -->  should all be considered dead
    // If Case 3
    //     NW = n - (lineLength + 1)
    //     W  = n - 1
    //     SW = n + (lineLength - 1)
    //     N  = n - lineLength
    //     S  = n + lineLength
    //     NE = n - (lineLength - 1)
    //     E  = n + 1
    //     SE = n + (lineLength + 1)
    //
}
