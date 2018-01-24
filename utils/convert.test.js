const convert = require('./convert');

// This is the HTML code returned in case Transactions are loaded correctly
const shouldReturnArray = `
    <div id="btGen">
    </div>
    <hr>
    <div id="dvTable"><table border="1"><tbody><tr><th>Account</th><th>Transaction</th><th>Amount</th></tr><tr><td>Checking</td><td>Transaction 1</td><td>73€</td></tr><tr><td>Checking</td><td>Transaction 2</td><td>54€</td></tr><tr><td>Checking</td><td>Transaction 3</td><td>87€</td></tr><tr><td>Checking</td><td>Transaction 4</td><td>76€</td></tr><tr><td>Checking</td><td>Transaction 5</td><td>101€</td></tr><tr><td>Checking</td><td>Transaction 6</td><td>34€</td></tr><tr><td>Checking</td><td>Transaction 7</td><td>43€</td></tr><tr><td>Checking</td><td>Transaction 8</td><td>20€</td></tr><tr><td>Checking</td><td>Transaction 9</td><td>105€</td></tr><tr><td>Checking</td><td>Transaction 10</td><td>74€</td></tr><tr><td>Checking</td><td>Transaction 11</td><td>75€</td></tr><tr><td>Checking</td><td>Transaction 12</td><td>64€</td></tr><tr><td>Checking</td><td>Transaction 13</td><td>109€</td></tr><tr><td>Checking</td><td>Transaction 14</td><td>30€</td></tr><tr><td>Checking</td><td>Transaction 15</td><td>95€</td></tr><tr><td>Checking</td><td>Transaction 16</td><td>60€</td></tr><tr><td>Checking</td><td>Transaction 17</td><td>73€</td></tr><tr><td>Checking</td><td>Transaction 18</td><td>34€</td></tr><tr><td>Checking</td><td>Transaction 19</td><td>71€</td></tr><tr><td>Checking</td><td>Transaction 20</td><td>68€</td></tr><tr><td>Checking</td><td>Transaction 21</td><td>73€</td></tr><tr><td>Checking</td><td>Transaction 22</td><td>54€</td></tr><tr><td>Checking</td><td>Transaction 23</td><td>71€</td></tr><tr><td>Checking</td><td>Transaction 24</td><td>40€</td></tr><tr><td>Checking</td><td>Transaction 25</td><td>69€</td></tr><tr><td>Checking</td><td>Transaction 26</td><td>74€</td></tr><tr><td>Checking</td><td>Transaction 27</td><td>71€</td></tr><tr><td>Checking</td><td>Transaction 28</td><td>56€</td></tr><tr><td>Checking</td><td>Transaction 29</td><td>121€</td></tr><tr><td>Checking</td><td>Transaction 30</td><td>110€</td></tr><tr><td>Checking</td><td>Transaction 31</td><td>119€</td></tr><tr><td>Checking</td><td>Transaction 32</td><td>52€</td></tr><tr><td>Checking</td><td>Transaction 33</td><td>53€</td></tr><tr><td>Checking</td><td>Transaction 34</td><td>42€</td></tr><tr><td>Checking</td><td>Transaction 35</td><td>107€</td></tr><tr><td>Checking</td><td>Transaction 36</td><td>132€</td></tr><tr><td>Checking</td><td>Transaction 37</td><td>73€</td></tr><tr><td>Checking</td><td>Transaction 38</td><td>82€</td></tr><tr><td>Checking</td><td>Transaction 39</td><td>79€</td></tr><tr><td>Checking</td><td>Transaction 40</td><td>96€</td></tr><tr><td>Checking</td><td>Transaction 41</td><td>61€</td></tr><tr><td>Checking</td><td>Transaction 42</td><td>50€</td></tr><tr><td>Checking</td><td>Transaction 43</td><td>99€</td></tr><tr><td>Checking</td><td>Transaction 44</td><td>136€</td></tr><tr><td>Checking</td><td>Transaction 45</td><td>89€</td></tr><tr><td>Checking</td><td>Transaction 46</td><td>46€</td></tr><tr><td>Checking</td><td>Transaction 47</td><td>131€</td></tr><tr><td>Checking</td><td>Transaction 48</td><td>80€</td></tr><tr><td>Checking</td><td>Transaction 49</td><td>101€</td></tr><tr><td>Checking</td><td>Transaction 50</td><td>114€</td></tr></tbody></table></div>
	<div>
		<a href="?start=100">Next --&gt;</a>
	</div>
    <script type="text/javascript" src="load.js"></script>
`;

// We verify that the conversion returns a Array of length 50
test('Transactions returned', () => {
  const data = convert(shouldReturnArray);
  expect(data.length).toBe(50);
});

/**
 * This is the HTML code returned when we asked for transactions more than the
 * cursor (?start=6000 for example).
 * Only the table header is present thus should return an empty array
 */
const shouldReturnEmptyArray = `
<div id="btGen">
    </div>
    <hr>
    <div id="dvTable"><table border="1"><tbody><tr><th>Account</th><th>Transaction</th><th>Amount</th></tr></tbody></table></div>
	<div>
		<a href="?start=100">Next --&gt;</a>
	</div>
    <script type="text/javascript" src="load.js"></script>
`;

// We verify that the conversion returns an empty Array
test('No transaction returned', () => {
  const data = convert(shouldReturnEmptyArray);
  expect(data.length).toBe(0);
});

/**
 * This is the HTML code returned when the transactions failed to load
 * or are loaded inside an iframe.
 * We don't care about this case so return null
 */
const shouldReturnEmpty = `
<div id="btGen">
    </div>
    <hr>
    <div id="dvTable">
    </div>
	<div>
		<a href="?start=100">Next --&gt;</a>
	</div>
    <script type="text/javascript" src="load.js"></script><iframe id="fm"></iframe>
`;

// We verify that the conversion returns null
test('No table element', () => {
  const data = convert(shouldReturnEmpty);
  expect(data.length).toBe(0);
});
