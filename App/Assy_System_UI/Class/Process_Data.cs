using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Assy_System_UI.Class
{
    public class Process_Data
    {
        public static uint[] ConvertString(char[] data, int data_len)
        {
            uint[] data_fill = new uint[(data_len + 1) / 2];

            ushort sum = 0;
            object param_lock = new object();

            for (int i = 0, j = 0; i < data_len; i += 2, j++)
            {
                if (i + 1 < data_len)
                {
                    sum = (ushort)(data[i] + (data[i + 1] << 8));
                }
                else
                {
                    sum = (ushort)data[i];
                }

                lock (param_lock)
                {
                    data_fill[j] = sum;
                }
            }
            return data_fill;
        }


        public static string ReverseToString(uint[] data_fill)
        {
            StringBuilder stringBuilder = new StringBuilder();

            for (int i = 0; i < data_fill.Length; i++)
            {
                ushort value = (ushort)(data_fill[i] & 0xFFFF);

                char lowByte = (char)(value & 0xFF);
                char highByte = (char)((value >> 8) & 0xFF);

                if (lowByte == 0 && highByte == 0)
                {
                    break; // Stop when encountering "00" in the original data
                }

                stringBuilder.Append(lowByte);
                stringBuilder.Append(highByte);
            }
            return stringBuilder.ToString();
        }
    }
}
