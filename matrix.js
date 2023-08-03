class Matrix {
  constructor(rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.data = [];

    for (let i = 0; i < this.rows; i++) {
      this.data[i] = [];
      for (let j = 0; j < this.cols; j++) {
        this.data[i][j] = 0;
      }
    }
  }

  multiply(n) {
    if (n instanceof Matrix) {
      if (n.rows == this.rows && n.cols == this.cols) {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.cols; j++) {
            this.data[i][j] *= n.data[i][j];
          }
        }
      } else {
        console.error(
          "element wise multiplication failed because of size mismatch!"
        );
      }
    } else {
      //scalar multiply
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.cols; j++) {
          this.data[i][j] *= n;
        }
      }
    }
  }

  static multiply(matx1, matx2) {
    if (
      matx1.cols == matx2.rows &&
      matx1 instanceof Matrix &&
      matx2 instanceof Matrix
    ) {
      let nrows = matx1.rows;
      let ncols = matx2.cols;
      let newmat = new Matrix(matx1.rows, matx2.cols);
      for (let i = 0; i < nrows; i++) {
        for (let j = 0; j < ncols; j++) {
          newmat.data[i][j] = 0;
          for (let k = 0; k < matx1.cols; k++) {
            newmat.data[i][j] += matx1.data[i][k] * matx2.data[k][j];
          }
        }
      }
      return newmat;
    } else {
      if (matx1 instanceof Matrix && !(matx2 instanceof Matrix)) {
        let n = matx2; //scalar value

        let imat = new Matrix(matx1.rows, matx1.cols);
        for (let i = 0; i < matx1.rows; i++)
          for (let j = 0; j < matx1.cols; j++)
            imat.data[i][j] = matx1.data[i][j];

        for (let i = 0; i < matx1.rows; i++) {
          for (let j = 0; j < matx1.cols; j++) {
            imat.data[i][j] *= n;
          }
        }
        return imat;
      } else {
        if (!(matx1.cols == matx2.rows)) console.error("size mismatch!");
        if (!(matx1 instanceof Matrix && matx2 instanceof Matrix))
          console.error(
            "argument to matrix multiplication func should be only Matrix objects"
          );
        console.error("Matrix multiplication failed!");
        return -1;
      }
    }
  }

  copy() {
    let newmat = new Matrix(this.rows, this.cols);
    for (let i = 0; i < this.rows; i++)
      for (let j = 0; j < this.cols; j++) newmat.data[i][j] = this.data[i][j];

    return newmat;
  }

  print() {
    console.table(this.data);
  }

  static transpose(imat) {
    let transposed = new Matrix(imat.cols, imat.rows);

    for (let i = 0; i < imat.cols; i++) {
      for (let j = 0; j < imat.rows; j++) {
        transposed.data[i][j] = imat.data[j][i];
      }
    }

    return transposed;
  }

  add(newdata) {
    if (newdata instanceof Matrix) {
      for (let i = 0; i < this.rows; i++)
        for (let j = 0; j < this.cols; j++)
          this.data[i][j] += newdata.data[i][j];
    } else {
      for (let i = 0; i < this.rows; i++)
        for (let j = 0; j < this.cols; j++) this.data[i][j] += newdata;
    }
  }

  static add(m1, m2) {
    if (
      m1 instanceof Matrix &&
      m2 instanceof Matrix &&
      m1.rows == m2.rows &&
      m1.cols == m2.cols
    ) {
      let newmat = new Matrix(m1.rows, m1.cols);

      for (let i = 0; i < m1.rows; i++) {
        for (let j = 0; j < m1.cols; j++) {
          newmat.data[i][j] = m1.data[i][j] + m2.data[i][j];
        }
      }

      return newmat;
    } else {
      if (!(m1.rows == m2.rows && m1.cols == m2.cols)) {
        m1.print();
        m2.print();
        console.error("invaild addition : size mismatch");
        return -1;
      }
      console.error("invaild addition");
      return -1;
    }
  }
  static subtract(m1, m2) {
    if (
      m1 instanceof Matrix &&
      m2 instanceof Matrix &&
      m1.rows == m2.rows &&
      m1.cols == m2.cols
    ) {
      let newmat = new Matrix(m1.rows, m1.cols);

      for (let i = 0; i < m1.rows; i++) {
        for (let j = 0; j < m1.cols; j++) {
          newmat.data[i][j] = m1.data[i][j] - m2.data[i][j];
        }
      }

      return newmat;
    } else {
      if (!(m1.rows == m2.rows && m1.cols == m2.cols)) {
        m1.print();
        m2.print();
        console.error("invaild addition : size mismatch");
        return -1;
      }
      console.error("invaild addition");
      return -1;
    }
  }
  subtract(matrix) {
    for (let i = 0; i < this.rows; i++)
      for (let j = 0; j < this.cols; j++) this.data[i][j] -= matrix.data[i][j];
  }

  map(func) {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        let val = this.data[i][j];
        this.data[i][j] = func(val);
      }
    }
  }

  static map(matrix, func) {
    let newmat = new Matrix(matrix.rows, matrix.cols);

    for (let i = 0; i < matrix.rows; i++) {
      for (let j = 0; j < matrix.cols; j++) {
        newmat.data[i][j] = func(matrix.data[i][j]);
      }
    }

    return newmat;
  }

  randomize() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.data[i][j] = Math.random() * 2 - 1;
      }
    }
  }

  static fromArray(arr) {
    let rows = arr.length;
    let cols = 1;

    let matrix = new Matrix(rows, cols);
    for (let i = 0; i < rows; i++) matrix.data[i][0] = arr[i];

    return matrix;
  }

  toArray() {
    let arr = [];
    for (let i = 0; i < this.rows; i++)
      for (let j = 0; j < this.cols; j++) arr.push(this.data[i][j]);
    return arr;
  }
  // Element-wise power operation
  static pow(matrix, power) {
    let newmat = new Matrix(matrix.rows, matrix.cols);
    for (let i = 0; i < matrix.rows; i++) {
      for (let j = 0; j < matrix.cols; j++) {
        newmat.data[i][j] = Math.pow(matrix.data[i][j], power);
      }
    }
    return newmat;
  }

  // Element-wise square root operation
  static sqrt(matrix) {
    let newmat = new Matrix(matrix.rows, matrix.cols);
    for (let i = 0; i < matrix.rows; i++) {
      for (let j = 0; j < matrix.cols; j++) {
        newmat.data[i][j] = Math.sqrt(matrix.data[i][j]);
      }
    }
    return newmat;
  }

  // Element-wise division
  static divide(m1, m2) {
    if (
      m1 instanceof Matrix &&
      m2 instanceof Matrix &&
      m1.rows == m2.rows &&
      m1.cols == m2.cols
    ) {
      let newmat = new Matrix(m1.rows, m1.cols);
      for (let i = 0; i < m1.rows; i++) {
        for (let j = 0; j < m1.cols; j++) {
          newmat.data[i][j] = m1.data[i][j] / m2.data[i][j];
        }
      }
      return newmat;
    } else {
      console.error("Size mismatch in element-wise division!");
      return -1;
    }
  }
}
