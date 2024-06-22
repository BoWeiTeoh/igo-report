/* 不需要链接 Method 模块的功能放在这里 */

const generateId = (number, type) => {
  switch (type) {
    case "user": {
      return `A${number.toString().padStart(3, '0')}`;
    }
    case "role": {
      return `R${number.toString().padStart(3, '0')}`;
    }
    case "department": {
        return `D${number.toString().padStart(3, '0')}`;
    }
  }
}

const commonFunc = {
  generateId
};

module.exports = commonFunc;