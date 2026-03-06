import Dropdown from 'react-bootstrap/Dropdown';

function OrderingDropdown({ onChangeFunction }) {
  return (
    <Dropdown className='Dropdowncolor'>
      <Dropdown.Toggle variant="secondary">
        ترتيب المنتجات
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item onClick={() => onChangeFunction('price')}>
          السعر: من الأقل للأعلى
        </Dropdown.Item>
        <Dropdown.Item onClick={() => onChangeFunction('-price')}>
          السعر: من الأعلى للأقل
        </Dropdown.Item>
        <Dropdown.Item onClick={() => onChangeFunction('-created_at')}>
          الأحدث
        </Dropdown.Item>
        <Dropdown.Item onClick={() => onChangeFunction('created_at')}>
          الأقدم
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default OrderingDropdown;
