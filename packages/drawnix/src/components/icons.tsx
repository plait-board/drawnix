import React from 'react';

export const createIcon = (svg: React.ReactNode) => {
  return svg;
};

export const HandIcon = createIcon(
  <svg viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <g id="Hand" stroke="none" fill="currentColor">
      <path d="M8.44583468,0.500225887 C9.07406934,0.510185679 9.54739531,0.839591366 9.86192311,1.34305279 C9.89696656,1.39914649 9.92878401,1.45492964 9.9576026,1.50991157 L9.9576026,1.50991157 L10.0210033,1.64201027 L10.061978,1.62350755 C10.1972891,1.56834247 10.3444107,1.53218464 10.5027907,1.51755353 L10.5027907,1.51755353 L10.6649031,1.51019133 C11.4883708,1.51019133 12.0208782,1.99343346 12.3023042,2.66393278 C12.3903714,2.87392911 12.4344191,3.10047818 12.4339446,3.3257952 L12.4339446,3.3257952 L12.4360033,3.80501027 L12.5160535,3.78341501 C12.6124478,3.76124046 12.7138812,3.74739854 12.820201,3.74250274 L12.820201,3.74250274 L12.9833264,3.74194533 C13.6121166,3.7657478 14.0645887,4.0801724 14.3087062,4.56112689 C14.4521117,4.8436609 14.4987984,5.11349437 14.4999262,5.33449618 L14.4999262,5.33449618 L14.3922653,12.049414 C14.3784752,12.909177 14.0717787,13.7360948 13.5212406,14.3825228 C13.4055676,14.5183496 13.2843697,14.643961 13.1582361,14.7596335 C12.4634771,15.3967716 11.755103,15.6538706 11.1897396,15.7000055 L11.1897396,15.7000055 L7.4723083,15.6798158 C7.14276373,15.634268 6.81580098,15.5154267 6.49455235,15.3472501 C6.25643701,15.2225944 6.06881706,15.0975452 5.88705731,14.9494308 L5.88705731,14.9494308 L2.55198782,11.500873 C2.39559475,11.3769079 2.17626793,11.1748532 1.9548636,10.9139403 C1.57867502,10.4706225 1.33501976,10.0139923 1.30330257,9.52833025 C1.28093191,9.18578476 1.37200912,8.85641102 1.5826788,8.56872564 C1.82538833,8.23725279 2.12881965,8.02107162 2.47470569,7.92957033 C2.95807982,7.80169771 3.42705723,7.92468989 3.86509644,8.18731167 C4.04431391,8.29475961 4.1816109,8.40304483 4.26225571,8.47866867 L4.26225571,8.47866867 L4.61400328,8.79701027 L4.57247249,3.59275349 L4.57628524,3.46204923 C4.5897691,3.23444442 4.64087578,2.95701848 4.75937106,2.66961597 C5.01017272,2.06131302 5.49670227,1.64692543 6.21363856,1.60818786 C6.44223508,1.59583681 6.65042099,1.62176802 6.83696985,1.68057551 L6.83696985,1.68057551 L6.86400328,1.69001027 C6.88501862,1.63593052 6.90764242,1.58175442 6.9331867,1.52672633 L6.9331867,1.52672633 L7.01883595,1.35955614 C7.31549194,0.832047939 7.79476072,0.48993549 8.44583468,0.500225887 Z M8.42684173,1.70001476 C8.26825412,1.69756905 8.16339456,1.77242008 8.06478367,1.94776814 C8.03967773,1.99241107 8.01831703,2.03811495 8.00083464,2.07855067 L8.00083464,2.07855067 L7.94879157,2.2035905 L7.94354455,2.20731401 L7.943,3.161 L7.97170661,3.16123746 L7.97170661,7.60991883 L6.77170661,7.60991883 L6.771,3.338 L6.74362358,3.33880359 C6.74284189,3.29064626 6.73014163,3.20282206 6.7002616,3.11094408 L6.66446012,3.01903385 C6.58982025,2.85766739 6.49843292,2.79455071 6.27838133,2.80644008 C6.07001018,2.81769881 5.95642108,2.91444507 5.86877664,3.12702089 C5.79792279,3.29887224 5.77228127,3.48655908 5.77246879,3.58977183 L5.77246879,3.58977183 L5.83613619,11.5252021 L3.41863956,9.33477657 L3.31637296,9.25979571 L3.24805011,9.21651224 C3.06096922,9.10434987 2.89279975,9.06024641 2.78159879,9.0896637 C2.71007735,9.10858411 2.63607367,9.1613084 2.55086305,9.27768211 C2.51020424,9.33320478 2.49638061,9.38319687 2.50075171,9.4501283 C2.51206889,9.62341997 2.64503022,9.87260054 2.86983366,10.1375191 C3.03268834,10.3294345 3.19762053,10.4813781 3.35554956,10.6131022 L3.35554956,10.6131022 L6.68454317,14.0569073 C6.71106575,14.0773808 6.74806086,14.1037158 6.79369091,14.1335929 L6.79369091,14.1335929 L6.95464838,14.2315311 L7.05111031,14.2841211 C7.25978123,14.3933622 7.46253523,14.4670573 7.55685495,14.4854708 L7.55685495,14.4854708 L11.1407985,14.5022108 C11.1503576,14.5013899 11.1627905,14.4997539 11.1779002,14.4971772 L11.1779002,14.4971772 L11.2991076,14.4694224 C11.3491682,14.4557375 11.4083624,14.437284 11.4751158,14.4130563 C11.769383,14.3062543 12.066676,14.1324596 12.3471758,13.8752234 C12.4371203,13.7927386 12.5240597,13.7026333 12.607654,13.6044743 C12.9760464,13.1719172 13.183059,12.6137678 13.1924195,12.030173 L13.1924195,12.030173 L13.3000132,5.32832551 C13.2997939,5.29016685 13.2826117,5.19085946 13.2386527,5.10425262 C13.1843838,4.99733326 13.1129774,4.94771265 12.9379578,4.94108739 C12.6814739,4.93138871 12.534132,5.11189595 12.4756792,5.39480062 L12.4768718,7.52734922 L11.2768718,7.52734922 L11.276,5.688 L11.2462883,5.6883208 L11.2339541,3.32771285 C11.2341,3.2560396 11.2209054,3.18817621 11.1957482,3.12818892 C11.0820579,2.85732094 10.9199288,2.71019133 10.6649031,2.71019133 C10.456829,2.71019133 10.3197487,2.87378067 10.2524297,3.11264939 L10.2530225,7.512783 L9.05302254,7.512783 L9.053,3.288 L9.01554331,3.28724203 L8.98800328,2.29901027 L8.9629175,2.22263368 C8.94515567,2.17417174 8.92167756,2.11937748 8.8924232,2.06330056 L8.8924232,2.06330056 L8.84420197,1.9788544 C8.72758855,1.79219249 8.59915015,1.70280728 8.42684173,1.70001476 Z"></path>
    </g>
  </svg>
);

export const SelectionIcon = createIcon(
  <svg viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <g id="selection" stroke="none" fill="currentColor">
      <path d="M1.38232686,2.38218266 L5.4143451,14.2246629 L5.45540179,14.3136477 C5.6738376,14.7029541 6.25143564,14.7273637 6.49230627,14.3232393 L8.11486037,11.5990854 L10.8833927,14.4351257 C11.1162256,14.673686 11.4988798,14.6767204 11.7354668,14.4418826 L14.1933351,12.0021862 L14.263123,11.9192708 C14.4260847,11.6858139 14.4039042,11.3621027 14.1959502,11.1531274 L11.3598604,8.30408543 L14.0003903,6.44278167 C14.4042341,6.15799031 14.3099422,5.5344405 13.8399491,5.38178897 L2.13023795,1.60291226 C1.65322163,1.44797961 1.20794286,1.91192855 1.38232686,2.38218266 Z M2.93689198,3.12556703 L12.3288604,6.15308543 L10.0883903,7.73315528 L10.0121747,7.79676991 C9.78025886,8.02517222 9.77056424,8.40723513 10.0088753,8.64671667 L12.9218604,11.5730854 L11.3198604,13.1630854 L8.42938714,10.2026992 L8.35682877,10.1391916 C8.07802132,9.93187508 7.66955488,10.0042813 7.48460396,10.3145856 L6.10286037,12.6310854 L2.93689198,3.12556703 Z"></path>
    </g>
  </svg>
);

export const MindIcon = createIcon(
  <svg viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <g id="Mind" stroke="none" fill="currentColor">
      <path d="M14.5,1.5 C15.3284271,1.5 16,2.17157288 16,3 L16,4.5 C16,5.32842712 15.3284271,6 14.5,6 L10.5,6 C9.70541385,6 9.05512881,5.38217354 9.00332687,4.60070262 L7.75,4.6 C6.70187486,4.6 5.75693372,5.0417832 5.09122946,5.7492967 L5.5,5.75 C6.32842712,5.75 7,6.42157288 7,7.25 L7,8.75 C7,9.57842712 6.32842712,10.25 5.5,10.25 L4.69703093,10.2512226 C5.3493111,11.2442937 6.47308134,11.9 7.75,11.9 L9.004,11.9 L9.00686658,11.85554 C9.07955132,11.0948881 9.72030388,10.5 10.5,10.5 L14.5,10.5 C15.3284271,10.5 16,11.1715729 16,12 L16,13.5 C16,14.3284271 15.3284271,15 14.5,15 L10.5,15 C9.67157288,15 9,14.3284271 9,13.5 L9,13.1 L7.75,13.1 C5.78479628,13.1 4.09258608,11.9311758 3.33061658,10.2507745 L1.5,10.25 C0.671572875,10.25 0,9.57842712 0,8.75 L0,7.25 C0,6.42157288 0.671572875,5.75 1.5,5.75 L3.5932906,5.74973863 C4.44206161,4.34167555 5.98606075,3.4 7.75,3.4 L9,3.4 L9,3 C9,2.17157288 9.67157288,1.5 10.5,1.5 L14.5,1.5 Z M14.5,11.7 L10.5,11.7 C10.3343146,11.7 10.2,11.8343146 10.2,12 L10.2,13.5 C10.2,13.6656854 10.3343146,13.8 10.5,13.8 L14.5,13.8 C14.6656854,13.8 14.8,13.6656854 14.8,13.5 L14.8,12 C14.8,11.8343146 14.6656854,11.7 14.5,11.7 Z M5.5,6.95 L1.5,6.95 C1.33431458,6.95 1.2,7.08431458 1.2,7.25 L1.2,8.75 C1.2,8.91568542 1.33431458,9.05 1.5,9.05 L5.5,9.05 C5.66568542,9.05 5.8,8.91568542 5.8,8.75 L5.8,7.25 C5.8,7.08431458 5.66568542,6.95 5.5,6.95 Z M14.5,2.7 L10.5,2.7 C10.3343146,2.7 10.2,2.83431458 10.2,3 L10.2,4.5 C10.2,4.66568542 10.3343146,4.8 10.5,4.8 L14.5,4.8 C14.6656854,4.8 14.8,4.66568542 14.8,4.5 L14.8,3 C14.8,2.83431458 14.6656854,2.7 14.5,2.7 Z"></path>
    </g>
  </svg>
);

export const ShapeIcon = createIcon(
  <svg viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <g id="geometry" stroke="none" fill="currentColor">
      <path d="M9.3,6.7 L1.7,6.7 L1.7,14.3 L9.3,14.3 L9.3,6.7 Z M10.5,9.8 C12.8748244,9.8 14.8,7.87482442 14.8,5.5 C14.8,3.12517558 12.8748244,1.2 10.5,1.2 C8.12517558,1.2 6.2,3.12517558 6.2,5.5 L9.5,5.5 C10.0522847,5.5 10.5,5.94771525 10.5,6.5 L10.5,9.8 Z M10.5,14.5 C10.5,15.0522847 10.0522847,15.5 9.5,15.5 L1.5,15.5 C0.94771525,15.5 0.5,15.0522847 0.5,14.5 L0.5,6.5 C0.5,5.94771525 0.94771525,5.5 1.5,5.5 L5,5.5 C5,2.46243388 7.46243388,0 10.5,0 C13.5375661,0 16,2.46243388 16,5.5 C16,8.53756612 13.5375661,11 10.5,11 L10.5,14.5 Z"></path>
    </g>
  </svg>
);

export const TextIcon = createIcon(
  <svg viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <g id="font" stroke="none" fill="currentColor">
      <path d="M4.75,14.5069828 C4.41862915,14.5069828 4.15,14.2383536 4.15,13.9069828 C4.15,13.5756119 4.41862915,13.3069828 4.75,13.3069828 L7.3993606,13.306 L7.3993606,2.7 L2.7113606,2.7 L2.7113606,4.10415313 C2.7113606,4.40238689 2.49377099,4.64979988 2.20868371,4.69630014 L2.1113606,4.70415313 C1.77998975,4.70415313 1.5113606,4.43552397 1.5113606,4.10415313 L1.5113606,2.1 C1.5113606,1.76862915 1.77998975,1.5 2.1113606,1.5 L13.8810378,1.5 C14.2124087,1.5 14.4810378,1.76862915 14.4810378,2.1 L14.4810378,4.10415313 C14.4810378,4.43552397 14.2124087,4.70415313 13.8810378,4.70415313 C13.549667,4.70415313 13.2810378,4.43552397 13.2810378,4.10415313 L13.2810378,2.7 L8.5993606,2.7 L8.5993606,13.306 L11.25,13.3069828 C11.5813708,13.3069828 11.85,13.5756119 11.85,13.9069828 C11.85,14.2383536 11.5813708,14.5069828 11.25,14.5069828 L4.75,14.5069828 Z"></path>
    </g>
  </svg>
);

export const StraightArrowLineIcon = createIcon(
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" version="1.1">
    <g id="straight-line" stroke="none" fill="currentColor">
      <path
        d="M8.55595221,-1.5261864 C8.88741773,-1.5261864 9.15621426,-1.25765205 9.15653772,-0.926186684 L9.16739175,10.3828136 L10.9946787,10.3836977 C11.2708211,10.3836977 11.4946787,10.6075553 11.4946787,10.8836977 C11.4946787,10.9607525 11.4768694,11.0367648 11.4426413,11.1058002 L8.8378495,16.3594519 C8.7642512,16.5078936 8.58425218,16.5685662 8.43581043,16.4949679 C8.37895485,16.4667786 8.33250284,16.4212859 8.30313336,16.3650308 L5.56226325,11.1150985 C5.43446412,10.8703088 5.52930372,10.5682659 5.77409341,10.4404667 C5.84552557,10.4031736 5.92491301,10.3836977 6.0054942,10.3836977 L7.96739175,10.3828136 L7.95653772,-0.926186684 C7.95621467,-1.25723416 8.22431979,-1.52586306 8.55536727,-1.52618611 Z"
        id=""
        transform="translate(8.500035, 7.500035) rotate(-135.000000) translate(-8.500035, -7.500035) "
      />
    </g>
  </svg>
);

export const RectangleIcon = createIcon(
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path
      d="M3 3h18v18H3z"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    ></path>
  </svg>
);

export const TerminalIcon = createIcon(
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
    <g id="terminal" stroke="none" fill="currentColor">
      <path d="M11,3 C13.7614237,3 16,5.23857625 16,8 C16,10.7614237 13.7614237,13 11,13 L5,13 C2.23857625,13 0,10.7614237 0,8 C0,5.23857625 2.23857625,3 5,3 L11,3 Z M11,4.2 L5,4.2 C2.90131795,4.2 1.2,5.90131795 1.2,8 C1.2,10.0330982 2.79664702,11.6932796 4.8044525,11.7950555 L5,11.8 L11,11.8 C13.098682,11.8 14.8,10.098682 14.8,8 C14.8,5.96690176 13.203353,4.30672042 11.1955475,4.20494454 L11,4.2 Z" />
    </g>
  </svg>
);

export const EllipseIcon = createIcon(
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" version="1.1">
    <g id="ellipse" stroke="none" fill="currentColor">
      <path d="M8,1 C11.8659932,1 15,4.13400675 15,8 C15,11.8659932 11.8659932,15 8,15 C4.13400675,15 1,11.8659932 1,8 C1,4.13400675 4.13400675,1 8,1 Z M8,2.2 C4.79674845,2.2 2.2,4.79674845 2.2,8 C2.2,11.2032515 4.79674845,13.8 8,13.8 C11.2032515,13.8 13.8,11.2032515 13.8,8 C13.8,4.79674845 11.2032515,2.2 8,2.2 Z" />
    </g>
  </svg>
);

export const TriangleIcon = createIcon(
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" version="1.1">
    <g id="triangle" stroke="none" fill="currentColor">
      <path d="M8.23125547,1.21366135 C8.3114266,1.25857939 8.37766784,1.32472334 8.42270367,1.40482837 L15.6471754,14.2549655 C15.7825042,14.4956743 15.6970768,14.800513 15.456368,14.9358418 C15.3815505,14.977905 15.2971646,15 15.2113335,15 L0.787227066,15 C0.511084691,15 0.287227066,14.7761424 0.287227066,14.5 C0.287227066,14.414418 0.309194147,14.3302684 0.351025556,14.2556064 L7.55066033,1.40546924 C7.6856352,1.1645618 7.99034802,1.07868648 8.23125547,1.21366135 Z M7.98695902,3.07926294 L1.98095902,13.7992629 L14.014959,13.7992629 L7.98695902,3.07926294 Z" />
    </g>
  </svg>
);

export const DiamondIcon = createIcon(
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" version="1.1">
    <g stroke="none" fill="currentColor">
      <path
        d="M13.7636471,2.6449804 C13.7716713,2.69552516 13.7718878,2.74700226 13.7642892,2.79761274 L12.3875778,11.9671885 C12.3550099,12.1841069 12.184864,12.3544698 11.9679874,12.3873141 L2.78433018,13.7781116 C2.511301,13.8194599 2.25644773,13.6316454 2.21509947,13.3586162 C2.20737253,13.307594 2.20759072,13.2556831 2.21574631,13.2047277 L3.67471119,4.08923146 C3.70888725,3.87570215 3.87646006,3.70834166 4.09003253,3.67443635 L13.1914362,2.22955927 C13.4641633,2.18626298 13.7203508,2.37225335 13.7636471,2.6449804 Z M12.4355704,3.5645263 L4.77957044,4.7795263 L3.55157044,12.4485263 L11.2775704,11.2775263 L12.4355704,3.5645263 Z"
        transform="translate(7.989647, 8.003560) rotate(-315.000000) translate(-7.989647, -8.003560) "
      />
    </g>
  </svg>
);

export const ParallelogramIcon = createIcon(
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" version="1.1">
    <g stroke="none" fill="currentColor">
      <path d="M15.3062871,3.5 C15.5824294,3.5 15.8062871,3.72385763 15.8062871,4 C15.8062871,4.05374105 15.7976231,4.10713065 15.7806287,4.15811388 L13.113962,12.1581139 C13.045905,12.362285 12.8548356,12.5 12.6396204,12.5 L0.693712943,12.5 C0.417570568,12.5 0.193712943,12.2761424 0.193712943,12 C0.193712943,11.946259 0.202376883,11.8928694 0.219371294,11.8418861 L2.88603796,3.84188612 C2.95409498,3.63771505 3.14516441,3.5 3.36037961,3.5 L15.3062871,3.5 Z M14.335,4.7 L3.864,4.7 L1.664,11.3 L12.134,11.3 L14.335,4.7 Z" />
    </g>
  </svg>
);

export const RoundRectangleIcon = createIcon(
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" version="1.1">
    <g stroke="none" fill="currentColor">
      <path d="M11,3 C13.7614237,3 16,5.23857625 16,8 C16,10.7614237 13.7614237,13 11,13 L5,13 C2.23857625,13 0,10.7614237 0,8 C0,5.23857625 2.23857625,3 5,3 L11,3 Z M11,4.2 L5,4.2 C2.90131795,4.2 1.2,5.90131795 1.2,8 C1.2,10.0330982 2.79664702,11.6932796 4.8044525,11.7950555 L5,11.8 L11,11.8 C13.098682,11.8 14.8,10.098682 14.8,8 C14.8,5.96690176 13.203353,4.30672042 11.1955475,4.20494454 L11,4.2 Z" />
    </g>
  </svg>
);

export const StraightArrowIcon = createIcon(
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" version="1.1">
    <g stroke="none" fill="currentColor">
      <path
        d="M8.55595221,-1.5261864 C8.88741773,-1.5261864 9.15621426,-1.25765205 9.15653772,-0.926186684 L9.16739175,10.3828136 L10.9946787,10.3836977 C11.2708211,10.3836977 11.4946787,10.6075553 11.4946787,10.8836977 C11.4946787,10.9607525 11.4768694,11.0367648 11.4426413,11.1058002 L8.8378495,16.3594519 C8.7642512,16.5078936 8.58425218,16.5685662 8.43581043,16.4949679 C8.37895485,16.4667786 8.33250284,16.4212859 8.30313336,16.3650308 L5.56226325,11.1150985 C5.43446412,10.8703088 5.52930372,10.5682659 5.77409341,10.4404667 C5.84552557,10.4031736 5.92491301,10.3836977 6.0054942,10.3836977 L7.96739175,10.3828136 L7.95653772,-0.926186684 C7.95621467,-1.25723416 8.22431979,-1.52586306 8.55536727,-1.52618611 Z"
        transform="translate(8.500035, 7.500035) rotate(-135.000000) translate(-8.500035, -7.500035) "
      />
    </g>
  </svg>
);

export const ElbowArrowIcon = createIcon(
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" version="1.1">
    <g stroke="none" fill="currentColor">
      <path d="M10.0153197,2.75391207 C10.0923746,2.75391207 10.1683869,2.77172133 10.2374222,2.80594949 L15.4910739,5.41074126 C15.6395156,5.48433956 15.7001882,5.66433859 15.6265899,5.81278033 C15.5984006,5.86963592 15.5529079,5.91608792 15.4966529,5.9454574 L10.2467205,8.68632752 C10.0019308,8.81412664 9.69988791,8.71928704 9.57208878,8.47449735 C9.53479568,8.40306519 9.51531974,8.32367776 9.51531974,8.24309656 L9.51458753,6.62591207 L6.16858753,6.62651279 L6.16914066,12.0061269 C6.16914066,12.3043606 5.95155104,12.5517736 5.66646377,12.5982739 L5.56914066,12.6061269 L0.534587532,12.6061269 C0.203216682,12.6061269 -0.0654124678,12.3374977 -0.0654124678,12.0061269 C-0.0654124678,11.674756 0.203216682,11.4061269 0.534587532,11.4061269 L4.96858753,11.4055128 L4.96914066,6.02651279 C4.96914066,5.72827903 5.18673027,5.48086604 5.47181754,5.43436578 L5.56914066,5.42651279 L9.51458753,5.42591207 L9.51531974,3.25391207 C9.51531974,2.9777697 9.73917736,2.75391207 10.0153197,2.75391207 Z" />
    </g>
  </svg>
);

export const CurveArrowIcon = createIcon(
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" version="1.1">
    <g stroke="none" fill="currentColor">
      <path d="M10.0153197,2.75391207 C10.0923746,2.75391207 10.1683869,2.77172133 10.2374222,2.80594949 L15.4910739,5.41074126 C15.6395156,5.48433956 15.7001882,5.66433859 15.6265899,5.81278033 C15.5984006,5.86963592 15.5529079,5.91608792 15.4966529,5.9454574 L10.2467205,8.68632752 C10.0019308,8.81412664 9.69988791,8.71928704 9.57208878,8.47449735 C9.53479568,8.40306519 9.51531974,8.32367776 9.51531974,8.24309656 L9.51423005,6.39035523 C5.97984781,6.85936966 3.21691607,9.08498364 1.18879108,13.1285821 C1.04022695,13.4247836 0.679673152,13.5444674 0.383471635,13.3959033 C0.0872701176,13.2473391 -0.0324136308,12.8867853 0.116150501,12.5905838 C2.34388813,8.14900524 5.48945543,5.65776043 9.51468497,5.18078677 L9.51531974,3.25391207 C9.51531974,2.9777697 9.73917736,2.75391207 10.0153197,2.75391207 Z" />
    </g>
  </svg>
);

export const MenuIcon = createIcon(
  <svg
    xmlns="http://www.w3.org/2000/svg"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <g strokeWidth="1.5">
      <path stroke="none" d="M0 0h24v24H0z"></path>
      <line x1="4" y1="6" x2="20" y2="6"></line>
      <line x1="4" y1="12" x2="20" y2="12"></line>
      <line x1="4" y1="18" x2="20" y2="18"></line>
    </g>
  </svg>
);

export const GithubIcon = createIcon(
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      d="M7.5 15.833c-3.583 1.167-3.583-2.083-5-2.5m10 4.167v-2.917c0-.833.083-1.166-.417-1.666 2.334-.25 4.584-1.167 4.584-5a3.833 3.833 0 0 0-1.084-2.667 3.5 3.5 0 0 0-.083-2.667s-.917-.25-2.917 1.084a10.25 10.25 0 0 0-5.166 0C5.417 2.333 4.5 2.583 4.5 2.583a3.5 3.5 0 0 0-.083 2.667 3.833 3.833 0 0 0-1.084 2.667c0 3.833 2.25 4.75 4.584 5-.5.5-.5 1-.417 1.666V17.5"
      strokeWidth="1.25"
    ></path>
  </svg>
);

export const ExportImageIcon = createIcon(
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <g
      strokeWidth="1.25"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    >
      <path stroke="none" d="M0 0h24v24H0z"></path>
      <path d="M15 8h.01"></path>
      <path d="M12 20h-5a3 3 0 0 1 -3 -3v-10a3 3 0 0 1 3 -3h10a3 3 0 0 1 3 3v5"></path>
      <path d="M4 15l4 -4c.928 -.893 2.072 -.893 3 0l4 4"></path>
      <path d="M14 14l1 -1c.617 -.593 1.328 -.793 2.009 -.598"></path>
      <path d="M19 16v6"></path>
      <path d="M22 19l-3 3l-3 -3"></path>
    </g>
  </svg>
);

export const ZoomOutIcon = createIcon(
  <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
    <g id="zoom-out" stroke="none" fill="currentColor" strokeWidth="1">
      <path
        fillRule="nonzero"
        d="M6.85,2.73225886e-13 C10.6331505,2.73225886e-13 13.7,3.06684946 13.7,6.85 C13.7,8.54194045 13.0865836,10.0906098 12.0700142,11.2857448 L15.4201976,14.5717081 C15.6567367,14.8037768 15.6603607,15.1836585 15.4282919,15.4201976 C15.1962232,15.6567367 14.8163415,15.6603607 14.5798024,15.4282919 L14.5798024,15.4282919 L11.2163456,12.128262 C10.0309427,13.1099691 8.50937591,13.7 6.85,13.7 C3.06684946,13.7 4.58522109e-14,10.6331505 4.58522109e-14,6.85 C4.58522109e-14,3.06684946 3.06684946,2.73225886e-13 6.85,2.73225886e-13 Z M6.85,1.2 C3.72959116,1.2 1.2,3.72959116 1.2,6.85 C1.2,9.97040884 3.72959116,12.5 6.85,12.5 C8.31753357,12.5 9.65438791,11.9404957 10.6588859,11.0231643 C10.6855412,10.9625408 10.7245275,10.9050898 10.7743982,10.8542584 C10.8288931,10.7987137 10.8915387,10.7560124 10.9585649,10.7261903 C11.9144009,9.71595758 12.5,8.35136579 12.5,6.85 C12.5,3.72959116 9.97040884,1.2 6.85,1.2 Z M4.6,6.2 L9.12944565,6.2 C9.4608165,6.2 9.72944565,6.46862915 9.72944565,6.8 C9.72944565,7.09823376 9.51185604,7.34564675 9.22676876,7.39214701 L9.12944565,7.4 L4.6,7.4 C4.26862915,7.4 4,7.13137085 4,6.8 C4,6.50176624 4.21758961,6.25435325 4.50267688,6.20785299 L4.6,6.2 L9.12944565,6.2 Z"
      ></path>
    </g>
  </svg>
);

export const ZoomInIcon = createIcon(
  <svg viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <g id="zoom-in" stroke="none" fill="currentColor" strokeWidth="1">
      <path
        fillRule="nonzero"
        d="M6.85,-1.81188398e-13 C10.6331505,-1.81188398e-13 13.7,3.06684946 13.7,6.85 C13.7,8.54194045 13.0865836,10.0906098 12.0700142,11.2857448 L15.4201976,14.5717081 C15.6567367,14.8037768 15.6603607,15.1836585 15.4282919,15.4201976 C15.1962232,15.6567367 14.8163415,15.6603607 14.5798024,15.4282919 L14.5798024,15.4282919 L11.2163456,12.128262 C10.0309427,13.1099691 8.50937591,13.7 6.85,13.7 C3.06684946,13.7 4.61852778e-14,10.6331505 4.61852778e-14,6.85 C4.61852778e-14,3.06684946 3.06684946,-1.81188398e-13 6.85,-1.81188398e-13 Z M6.85,1.2 C3.72959116,1.2 1.2,3.72959116 1.2,6.85 C1.2,9.97040884 3.72959116,12.5 6.85,12.5 C8.31753357,12.5 9.65438791,11.9404957 10.6588859,11.0231643 C10.6855412,10.9625408 10.7245275,10.9050898 10.7743982,10.8542584 C10.8288931,10.7987137 10.8915387,10.7560124 10.9585649,10.7261903 C11.9144009,9.71595758 12.5,8.35136579 12.5,6.85 C12.5,3.72959116 9.97040884,1.2 6.85,1.2 Z M6.86472282,3.93527718 C7.16295659,3.93527718 7.41036958,4.15286679 7.45686984,4.43795406 L7.46472282,4.53527718 L7.464,6.19927718 L9.12944565,6.2 C9.42767941,6.2 9.6750924,6.41758961 9.72159266,6.70267688 L9.72944565,6.8 C9.72944565,7.09823376 9.51185604,7.34564675 9.22676876,7.39214701 L9.12944565,7.4 L7.464,7.39927718 L7.46472282,9.06472282 C7.46472282,9.36295659 7.24713321,9.61036958 6.96204594,9.65686984 L6.86472282,9.66472282 C6.56648906,9.66472282 6.31907607,9.44713321 6.27257581,9.16204594 L6.26472282,9.06472282 L6.264,7.39927718 L4.6,7.4 C4.30176624,7.4 4.05435325,7.18241039 4.00785299,6.89732312 L4,6.8 C4,6.50176624 4.21758961,6.25435325 4.50267688,6.20785299 L4.6,6.2 L6.264,6.19927718 L6.26472282,4.53527718 C6.26472282,4.2701805 6.43664548,4.0452385 6.67507642,3.96586557 L6.76739971,3.94313016 L6.86472282,3.93527718 Z"
      ></path>
    </g>
  </svg>
);

export const SaveFileIcon = createIcon(
  <svg viewBox="0 0 18 18" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <g id="save-file" stroke="none" fill="currentColor">
      <path
        fillRule="nonzero"
        d="M11.064 9.1l2.645 2.595.03-.029.848.849-3.523 3.323-.848-.848 1.994-1.883H7.5v-1.2h4.712l-1.996-1.958.848-.849zM9.356.3L13.7 3.71V7.9h-1.2l-.001-2.633H8.5V1.5L3.1 1.5a.4.4 0 0 0-.392.32L2.7 1.9v12a.4.4 0 0 0 .32.392l.08.008h3.418v1.2H3.1a1.6 1.6 0 0 1-1.593-1.454L1.5 13.9v-12A1.6 1.6 0 0 1 2.954.307L3.1.3h6.256zM9.7 2.095v1.973l2.51-.001L9.7 2.095z"
      ></path>
    </g>
  </svg>
);

export const OpenFileIcon = createIcon(
  <svg viewBox="0 0 18 18" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <g id="save-file" stroke="currentColor" fill="none">
      <path
        d="m9.257 6.351.183.183H15.819c.34 0 .727.182 1.051.506.323.323.505.708.505 1.05v5.819c0 .316-.183.7-.52 1.035-.337.338-.723.522-1.037.522H4.182c-.352 0-.74-.181-1.058-.5-.318-.318-.499-.705-.499-1.057V5.182c0-.351.181-.736.5-1.054.32-.321.71-.503 1.057-.503H6.53l2.726 2.726Z"
        strokeWidth="1.25"
      />
    </g>
  </svg>
);

export const BackgroundColorIcon = createIcon(
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className="background-color-icon"
  >
    <g transform="translate(1 1)" fillRule="evenodd" fill="#000" stroke="none">
      <circle fillOpacity=".04" r="11" cy="11" cx="11"></circle>
      <path
        d="M17 20.221V17h3.221A11.06 11.06 0 0 1 17 20.221zm-12 0A11.06 11.06 0 0 1 1.779 17H5v3.221zM20.221 5H17V1.779A11.06 11.06 0 0 1 20.221 5zM9 .181V1H6.411A10.919 10.919 0 0 1 9 .181zM15.589 1H13V.181c.907.167 1.775.445 2.589.819zM13 21.819V21h2.589c-.814.374-1.682.652-2.589.819zm-4 0A10.919 10.919 0 0 1 6.411 21H9v.819zm-8-6.23A10.919 10.919 0 0 1 .181 13H1v2.589zm0-9.178V9H.181C.348 8.093.626 7.225 1 6.411zM21.819 9H21V6.411c.374.814.652 1.682.819 2.589zM21 15.589V13h.819A10.919 10.919 0 0 1 21 15.589zM5 1.779V5H1.779A11.06 11.06 0 0 1 5 1.779zM5 13h4v4H5v-4zm8 0h4v4h-4v-4zM5 5h4v4H5V5zm8 0h4v4h-4V5zm0 12v4H9v-4h4zm8-8v4h-4V9h4zm-8 0v4H9V9h4zM5 9v4H1V9h4zm8-8v4H9V1h4z"
        fillOpacity=".12"
      ></path>
    </g>
  </svg>
);

export const NoColorIcon = createIcon(
  <svg viewBox="0 0 32 32" className="no-color-icon">
    <g
      xmlns="http://www.w3.org/2000/svg"
      fillRule="nonzero"
      fill="currentColor"
      stroke="none"
    >
      <path d="M2 16c0 7.733 6.267 14 14 14s14-6.267 14-14S23.733 2 16 2 2 8.267 2 16zm-1 0C1 7.716 7.714 1 16 1c8.284 0 15 6.714 15 15 0 8.284-6.714 15-15 15-8.284 0-15-6.714-15-15z"></path>
      <path d="M6.354 26.354l-.708-.708 20-20 .708.708z"></path>
    </g>
  </svg>
);

export const Check = createIcon(
  <svg
    className="selected-icon"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

export const StrokeIcon = createIcon(
  <svg viewBox="0 0 24 24" className="stroke-icon">
    <g
      xmlns="http://www.w3.org/2000/svg"
      stroke="none"
      fillRule="evenodd"
      fill="#000"
    >
      <path
        d="M12 5a7 7 0 1 0 0 14 7 7 0 0 0 0-14zm0-4c6.075 0 11 4.925 11 11s-4.925 11-11 11S1 18.075 1 12 5.925 1 12 1z"
        fillRule="nonzero"
        fillOpacity=".04"
      ></path>
      <path
        d="M12 5V1c1.491 0 2.914.297 4.21.835L14.68 5.53A6.979 6.979 0 0 0 12 5zm4.95 2.048l2.828-2.828a11.016 11.016 0 0 1 2.388 3.568l-3.697 1.53a7.01 7.01 0 0 0-1.519-2.27zM19 12h4c0 1.491-.297 2.914-.835 4.21l-3.696-1.53c.342-.826.531-1.73.531-2.68zm-2.05 4.95l2.828 2.828a11.016 11.016 0 0 1-3.567 2.387l-1.532-3.696a7.01 7.01 0 0 0 2.27-1.52zM12 19v4c-1.491 0-2.914-.297-4.21-.835l1.53-3.696c.826.342 1.73.531 2.68.531zm-4.95-2.05l-2.828 2.828a11.016 11.016 0 0 1-2.387-3.567l3.696-1.532a7.01 7.01 0 0 0 1.52 2.27zM5 12H1c0-1.491.297-2.914.835-4.21L5.53 9.32A6.979 6.979 0 0 0 5 12zm2.05-4.95L4.222 4.222a11.016 11.016 0 0 1 3.567-2.387L9.321 5.53a7.01 7.01 0 0 0-2.27 1.52z"
        fillOpacity=".12"
      ></path>
    </g>
  </svg>
);

export const StrokeWhiteIcon = createIcon(
  <svg viewBox="0 0 24 24">
    <g
      xmlns="http://www.w3.org/2000/svg"
      id="icon-border-white"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
      opacity="0.1"
    >
      <g id="Group">
        <path
          d="M12,22 C17.5228475,22 22,17.5228475 22,12 C22,6.4771525 17.5228475,2 12,2 C6.4771525,2 2,6.4771525 2,12 C2,17.5228475 6.4771525,22 12,22 Z M12,23 C5.92486775,23 1,18.0751322 1,12 C1,5.92486775 5.92486775,1 12,1 C18.0751322,1 23,5.92486775 23,12 C23,18.0751322 18.0751322,23 12,23 Z"
          fill="#000000"
          fillRule="nonzero"
        />
        <path
          d="M12,19 C15.8659932,19 19,15.8659932 19,12 C19,8.13400675 15.8659932,5 12,5 C8.13400675,5 5,8.13400675 5,12 C5,15.8659932 8.13400675,19 12,19 Z M12,20 C7.581722,20 4,16.418278 4,12 C4,7.581722 7.581722,4 12,4 C16.418278,4 20,7.581722 20,12 C20,16.418278 16.418278,20 12,20 Z"
          fill="#000000"
          fillRule="nonzero"
        />
      </g>
    </g>
  </svg>
);

export const StrokeStyleNormalIcon = createIcon(
  <svg viewBox="0 0 24 32" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(0 14)" fillRule="evenodd" fill="none">
      <path d="M-18-19h60v40h-60z"></path>
      <path d="M0 0h24v2H0z" fill="currentColor"></path>
    </g>
  </svg>
);

export const StrokeStyleDashedIcon = createIcon(
  <svg viewBox="0 0 24 32" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(0 14)" fillRule="evenodd" fill="none">
      <g fill="currentColor">
        <path d="M0 0h6v2H0zM9 0h6v2H9zM18 0h6v2h-6z"></path>
      </g>
    </g>
  </svg>
);

export const StrokeStyleDotedIcon = createIcon(
  <svg viewBox="0 0 24 32" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(0 14)" fillRule="evenodd" fill="none">
      <g fill="currentColor">
        <rect rx="1" height="2" width="2"></rect>
        <rect rx="1" x="4" height="2" width="2"></rect>
        <rect rx="1" x="8" height="2" width="2"></rect>
        <rect rx="1" x="12" height="2" width="2"></rect>
        <rect rx="1" x="16" height="2" width="2"></rect>
        <rect rx="1" x="20" height="2" width="2"></rect>
      </g>
    </g>
  </svg>
);

export const FontColorIcon: React.FC<{ currentColor?: string }> = ({
  currentColor,
}) => {
  return (
    <svg
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      className="font-color-icon"
    >
      <g
        id="font-color"
        strokeWidth="1"
        fillRule="evenodd"
        stroke="none"
        fill="currentColor"
      >
        <path
          id="secondary-color"
          d="M1.999 15.011h11.998V13.81H1.999z"
          fill={currentColor || '#333333'}
        ></path>
        <path
          d="M6.034 7.59h4.104L8.086 2.297 6.034 7.59zm-.465 1.2l-1.437 3.707H2.845L7.301 1h1.287l-.001.004h.286l4.454 11.492h-1.288L10.603 8.79H5.569z"
          id="A"
        ></path>
      </g>
    </svg>
  );
};

export const UndoIcon = createIcon(
  <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
    <g stroke="none" fill="currentColor">
      <g id="undo-cion" transform="translate(1 1)">
        <path
          d="M3.84 5.825a.6.6 0 0 1 .063.774l-.064.075a.6.6 0 0 1-.774.063l-.074-.063L.176 3.859a.6.6 0 0 1-.064-.775l.064-.074L3.01.176a.6.6 0 0 1 .912.774l-.063.074-1.795 1.794h6.851a5.1 5.1 0 0 1 .216 10.196l-.216.004h-4a.6.6 0 0 1-.097-1.192l.097-.008h4a3.9 3.9 0 0 0 .201-7.795l-.2-.005H2.033l1.805 1.807z"
          id="undo-icon-path"
        ></path>
      </g>
    </g>
  </svg>
);

export const RedoIcon = createIcon(
  <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
    <g stroke="none" fill="currentColor">
      <g id="redo-cion" transform="matrix(-1 0 0 1 15.015 1)">
        <path
          d="M3.84 5.825a.6.6 0 0 1 .063.774l-.064.075a.6.6 0 0 1-.774.063l-.074-.063L.176 3.859a.6.6 0 0 1-.064-.775l.064-.074L3.01.176a.6.6 0 0 1 .912.774l-.063.074-1.795 1.794h6.851a5.1 5.1 0 0 1 .216 10.196l-.216.004h-4a.6.6 0 0 1-.097-1.192l.097-.008h4a3.9 3.9 0 0 0 .201-7.795l-.2-.005H2.033l1.805 1.807z"
          id="redo-icon-path"
        ></path>
      </g>
    </g>
  </svg>
);

export const TrashIcon = createIcon(
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor">
    <path
      strokeWidth="1.25"
      d="M3.333 5.833h13.334M8.333 9.167v5M11.667 9.167v5M4.167 5.833l.833 10c0 .92.746 1.667 1.667 1.667h6.666c.92 0 1.667-.746 1.667-1.667l.833-10M7.5 5.833v-2.5c0-.46.373-.833.833-.833h3.334c.46 0 .833.373.833.833v2.5"
    ></path>
  </svg>
);

export const DuplicateIcon = createIcon(
  <svg
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g strokeWidth="1.25">
      <path d="M14.375 6.458H8.958a2.5 2.5 0 0 0-2.5 2.5v5.417a2.5 2.5 0 0 0 2.5 2.5h5.417a2.5 2.5 0 0 0 2.5-2.5V8.958a2.5 2.5 0 0 0-2.5-2.5Z"></path>
      <path d="M11.667 3.125c.517 0 .986.21 1.325.55.34.338.55.807.55 1.325v1.458H8.333c-.485 0-.927.185-1.26.487-.343.312-.57.75-.609 1.24l-.005 5.357H5a1.87 1.87 0 0 1-1.326-.55 1.87 1.87 0 0 1-.549-1.325V5c0-.518.21-.987.55-1.326.338-.34.807-.549 1.325-.549h6.667Z"></path>
    </g>
  </svg>
);

export const FeltTipPenIcon = createIcon(
  <svg
    viewBox="0 0 1024 1024"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M170.794667 896c3.456 0 6.912-0.426667 10.325333-1.28l170.666667-42.666667c7.509333-1.877333 14.378667-5.76 19.84-11.221333L896.128 316.330667c16.128-16.128 25.002667-37.546667 25.002667-60.330667s-8.874667-44.202667-25.002667-60.330667L828.458667 128c-32.256-32.256-88.405333-32.256-120.661334 0L183.296 652.501333a42.794667 42.794667 0 0 0-11.221333 19.797334l-42.666667 170.666666A42.666667 42.666667 0 0 0 170.794667 896z m597.333333-707.669333L835.797333 256l-67.669333 67.669333L700.458667 256l67.669333-67.669333zM251.989333 704.469333l388.138667-388.138666L707.797333 384l-388.181333 388.138667-90.197333 22.528 22.570666-90.197334z"></path>
  </svg>
);

export const ImageIcon = createIcon(
  <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
    <g id="image" stroke="none" fill="currentColor">
      <path d="M10.496 7c-.824 0-1.572-.675-1.498-1.5 0-.825.674-1.5 1.498-1.5.823 0 1.497.675 1.497 1.5S11.319 7 10.496 7zM13.8 9.476V2.2H2.2v5.432l.1-.078C3.132 6.904 4.029 6.5 5 6.5c.823 0 1.552.27 2.342.778.226.145.449.304.735.518.06.045.546.413.69.52 1.634 1.21 2.833 1.6 4.798 1.207l.235-.047zm0 1.523V10.7c-5 1-6.3-3-8.8-3-1.5 0-2.8 1.6-2.8 1.6v4.6h11.6V11zM14 1c.6 0 1 .536 1 1.071v11.784c0 .642-.4 1.071-1 1.071H2c-.6 0-1-.429-1-1.07V2.07c0-.535.4-1.07 1-1.07h12z"></path>
    </g>
  </svg>
);

export const ExtraToolsIcon = createIcon(
  <svg
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g strokeWidth={1.8} fill="none">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path d="M12 3l-4 7h8z"></path>
      <path d="M17 17m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"></path>
      <path d="M4 14m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z"></path>
    </g>
  </svg>
);

export const MermaidLogoIcon = createIcon(
  <svg
    stroke="currentColor"
    viewBox="0 0 512 512"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      stroke='none'
      fill="currentColor"
      d="M407.48,111.18C335.587,108.103 269.573,152.338 245.08,220C220.587,152.338 154.573,108.103 82.68,111.18C80.285,168.229 107.577,222.632 154.74,254.82C178.908,271.419 193.35,298.951 193.27,328.27L193.27,379.13L296.9,379.13L296.9,328.27C296.816,298.953 311.255,271.42 335.42,254.82C382.596,222.644 409.892,168.233 407.48,111.18Z"
    />
  </svg>
);
